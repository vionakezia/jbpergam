import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { Status } from "@/data/products";
type AdminGame = "Free Fire" | "Mobile Legends" | "Rental" | "JasaPost";
type DbGame = "Free Fire" | "Mobile Legends" | "Rental" | "JasaPost";

interface PackageDraft {
  id?: string;
  duration: string;
  price: number;
}

interface ImageDraft {
  id?: string;
  url: string;
  isNew?: boolean;
}

interface Props {
  productId?: string;
}

export function ProductForm({ productId }: Props) {
  const navigate = useNavigate();
  const isEdit = !!productId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [game, setGame] = useState<AdminGame>("Free Fire");
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<Status>("Ready");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState<string>("");
  const [gallery, setGallery] = useState<ImageDraft[]>([]);
  const [packages, setPackages] = useState<PackageDraft[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const [{ data: prod }, { data: imgs }, { data: pkgs }] = await Promise.all([
        supabase.from("products").select("*").eq("id", productId).single(),
        supabase
          .from("product_images")
          .select("*")
          .eq("product_id", productId)
          .order("sort_order"),
        supabase
          .from("rental_packages")
          .select("*")
          .eq("product_id", productId)
          .order("sort_order"),
      ]);
      if (prod) {
        setName(prod.name);
        setGame(prod.game as AdminGame);
        setPrice(prod.price);
        setStatus(prod.status as Status);
        setDescription(prod.description);
        setMainImage(prod.image_url ?? "");
      }
      setGallery((imgs ?? []).map((i) => ({ id: i.id, url: i.image_url })));
      setPackages(
        (pkgs ?? []).map((p) => ({ id: p.id, duration: p.duration, price: p.price })),
      );
      setLoading(false);
    })();
  }, [productId, isEdit]);

  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type });
    setUploading(false);
    if (upErr) {
      setError("Upload gagal: " + upErr.message);
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) setMainImage(url);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) setGallery((g) => [...g, { url, isNew: true }]);
    }
    e.target.value = "";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    let pid = productId;
    if (isEdit) {
      const { error: upErr } = await supabase
        .from("products")
        .update({
          name,
          game: game as DbGame,
          price,
          status,
          description,
          image_url: mainImage || null,
        })
        .eq("id", productId);
      if (upErr) {
        setError(upErr.message);
        setSaving(false);
        return;
      }
    } else {
      const { data, error: insErr } = await supabase
        .from("products")
        .insert({
          name,
          game: game as DbGame,
          price,
          status,
          description,
          image_url: mainImage || null,
        })
        .select("id")
        .single();
      if (insErr || !data) {
        setError(insErr?.message ?? "Gagal membuat produk");
        setSaving(false);
        return;
      }
      pid = data.id;
    }

    if (!pid) {
      setSaving(false);
      return;
    }

    await supabase.from("product_images").delete().eq("product_id", pid);
    if (gallery.length > 0) {
      await supabase.from("product_images").insert(
        gallery.map((g, i) => ({
          product_id: pid!,
          image_url: g.url,
          sort_order: i,
        })),
      );
    }

    await supabase.from("rental_packages").delete().eq("product_id", pid);
    if (game === "Rental" && packages.length > 0) {
      await supabase.from("rental_packages").insert(
        packages.map((p, i) => ({
          product_id: pid!,
          duration: p.duration,
          price: p.price,
          sort_order: i,
        })),
      );
    }

    setSaving(false);
    navigate({ to: "/admin" });
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Memuat...</div>;
  }

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-6">
      <div className="card-surface rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Informasi Produk</h2>

        <Field label="Nama Produk">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Kategori">
            <select
              value={game}
              onChange={(e) => setGame(e.target.value as AdminGame)}
              className="input"
            >
              <option value="Free Fire">Free Fire</option>
              <option value="Mobile Legends">Mobile Legends</option>
              <option value="Rental">Rental</option>
              <option value="JasaPost">JasaPost</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="input"
            >
              <option value="Ready">Ready</option>
              <option value="Not Available">Not Available</option>
            </select>
          </Field>
        </div>

        <Field label="Harga (IDR)">
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="input"
            placeholder="0 jika hanya pakai paket rental"
          />
        </Field>

        <Field label="Deskripsi">
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input resize-y"
          />
        </Field>
      </div>

      <div className="card-surface rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg">Gambar Utama (3:4)</h2>
        {mainImage && (
          <div className="relative w-40 aspect-[3/4] rounded-xl overflow-hidden border border-border">
            <img src={mainImage} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setMainImage("")}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground text-xs"
            >
              ✕
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleMainImageUpload}
          className="text-sm"
        />
      </div>

      <div className="card-surface rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Galeri Gambar Tambahan</h2>
          <span className="text-xs text-muted-foreground">{gallery.length} gambar</span>
        </div>
        {gallery.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {gallery.map((g, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <img src={g.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
          className="text-sm"
        />
      </div>

      {game === "Rental" && (
        <div className="card-surface rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg">Paket Rental</h2>
            <button
              type="button"
              onClick={() => setPackages([...packages, { duration: "", price: 0 }])}
              className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground"
            >
              + Tambah Paket
            </button>
          </div>
          {packages.length === 0 && (
            <p className="text-sm text-muted-foreground">Belum ada paket. Klik "+ Tambah Paket".</p>
          )}
          {packages.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
              <Field label={i === 0 ? "Durasi" : ""}>
                <input
                  required
                  value={p.duration}
                  onChange={(e) => {
                    const next = [...packages];
                    next[i] = { ...p, duration: e.target.value };
                    setPackages(next);
                  }}
                  placeholder="6 Jam"
                  className="input"
                />
              </Field>
              <Field label={i === 0 ? "Harga" : ""}>
                <input
                  required
                  type="number"
                  min={0}
                  value={p.price}
                  onChange={(e) => {
                    const next = [...packages];
                    next[i] = { ...p, price: Number(e.target.value) };
                    setPackages(next);
                  }}
                  className="input"
                />
              </Field>
              <button
                type="button"
                onClick={() => setPackages(packages.filter((_, idx) => idx !== i))}
                className="h-11 px-3 rounded-xl border border-destructive/40 text-destructive text-xs"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3 sticky bottom-4">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin" })}
          className="px-5 py-2.5 rounded-full border border-border hover:border-primary/50 text-sm"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold glow-purple-sm disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : uploading ? "Upload..." : isEdit ? "Simpan Perubahan" : "Buat Produk"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      {label && (
        <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
          {label}
        </span>
      )}
      {children}
    </label>
  );
}
