import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import type { GameType, Product } from "@/data/products";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const CATEGORIES: { v: "all" | GameType; label: string; icon: string }[] = [
  { v: "all", label: "Semua", icon: "📦" },
  { v: "Free Fire", label: "Free Fire", icon: "🔥" },
  { v: "Mobile Legends", label: "Mobile Legends", icon: "⚔️" },
  { v: "Rental", label: "Rental", icon: "🎮" },
];

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

function AdminDashboard() {
  const { products, loading } = useProducts();
  const [category, setCategory] = useState<"all" | GameType>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      category === "all"
        ? products
        : products.filter((p) => p.game === category),
    [products, category],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      map[p.game] = (map[p.game] ?? 0) + 1;
    });
    return map;
  }, [products]);

  const handleDelete = async (p: Product) => {
    if (!confirm(`Hapus produk "${p.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(p.id);
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    setDeletingId(null);
    if (error) alert("Gagal menghapus: " + error.message);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Kelola Produk</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tambah, ubah, atau hapus produk. Perubahan langsung muncul di website.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-full border border-border hover:border-primary/50 text-sm font-medium transition"
          >
            👥 Akun Admin
          </Link>
          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold glow-purple-sm hover:-translate-y-0.5 transition"
          >
            + Tambah Produk
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.v}
            onClick={() => setCategory(c.v)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              category === c.v
                ? "bg-primary text-primary-foreground border-primary glow-purple-sm"
                : "bg-card/60 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="mr-1.5">{c.icon}</span>
            {c.label}
            <span className="ml-2 text-[10px] opacity-70">({counts[c.v] ?? 0})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-sm">Memuat...</div>
      ) : filtered.length === 0 ? (
        <div className="card-surface rounded-2xl p-16 text-center">
          <div className="text-5xl mb-3">📦</div>
          <h3 className="font-display font-semibold text-lg">Belum ada produk</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Klik "+ Tambah Produk" untuk membuat produk pertama.
          </p>
        </div>
      ) : (
        <div className="card-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted grid place-items-center text-xl">
                            🎮
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm">{p.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                        {p.game}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {p.rentalPackages?.length
                        ? `Mulai ${formatIDR(p.rentalPackages[0].price)}`
                        : p.price > 0
                        ? formatIDR(p.price)
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {p.status === "Ready" ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary-glow border border-primary/40">
                          Ready
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to="/admin/products/$id"
                          params={{ id: p.id }}
                          className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deletingId === p.id}
                          className="text-xs px-3 py-1.5 rounded-full border border-destructive/40 text-destructive hover:bg-destructive/10 transition disabled:opacity-50"
                        >
                          {deletingId === p.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
