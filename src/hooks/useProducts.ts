import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

interface RawProduct {
  id: string;
  name: string;
  game: "Free Fire" | "Mobile Legends" | "Rental";
  price: number;
  status: "Ready" | "Not Available";
  description: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

interface RawPackage {
  id: string;
  product_id: string;
  duration: string;
  price: number;
  sort_order: number;
}

interface RawImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
}

function buildProducts(
  rows: RawProduct[],
  pkgs: RawPackage[],
  images: RawImage[],
): Product[] {
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    game: r.game,
    price: r.price,
    status: r.status,
    description: r.description,
    image: r.image_url ?? undefined,
    createdAt: new Date(r.created_at).getTime(),
    rentalPackages: pkgs
      .filter((p) => p.product_id === r.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({ id: p.id, duration: p.duration, price: p.price })),
    gallery: images
      .filter((i) => i.product_id === r.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.image_url),
  }));
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    const [{ data: prods }, { data: pkgs }, { data: imgs }] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase.from("rental_packages").select("*"),
      supabase.from("product_images").select("*"),
    ]);
    setProducts(
      buildProducts(
        (prods ?? []) as RawProduct[],
        (pkgs ?? []) as RawPackage[],
        (imgs ?? []) as RawImage[],
      ),
    );
    setLoading(false);
  };

  useEffect(() => {
    refetch();

    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => refetch(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rental_packages" },
        () => refetch(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_images" },
        () => refetch(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, loading, refetch };
}
