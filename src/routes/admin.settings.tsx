import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const { settings, loading, refetch } = useSiteSettings();
  const [waNumber, setWaNumber] = useState("");
  const [igUrl, setIgUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setWaNumber(settings.whatsappNumber);
      setIgUrl(settings.instagramUrl);
    }
  }, [loading, settings.whatsappNumber, settings.instagramUrl]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const cleanWa = waNumber.replace(/[^0-9]/g, "");
    const { error } = await supabase
      .from("site_settings")
      .update({
        whatsapp_number: cleanWa,
        instagram_url: igUrl.trim(),
      })
      .eq("id", true);
    setSaving(false);
    if (error) {
      setMsg("Gagal menyimpan: " + error.message);
    } else {
      setMsg("Tersimpan! Perubahan langsung muncul di website.");
      refetch();
    }
  };

  return (
    <div className="max-w-2xl">
      <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground">
        ← Kembali
      </Link>
      <h1 className="font-display text-3xl font-bold mt-2 mb-2">Pengaturan Kontak</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Nomor WhatsApp dan Instagram di sini akan digunakan di seluruh website utama (kecuali
        kategori Partner Resmi & Paid Promote yang punya nomor sendiri per produk). Perubahan tampil
        real-time.
      </p>

      <form onSubmit={handleSave} className="card-surface rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Nomor WhatsApp Admin
          </label>
          <input
            type="text"
            value={waNumber}
            onChange={(e) => setWaNumber(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="6282312715218"
            className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm"
          />
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Format internasional tanpa "+" atau spasi. Contoh: 6282312715218
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            URL Instagram
          </label>
          <input
            type="url"
            value={igUrl}
            onChange={(e) => setIgUrl(e.target.value)}
            placeholder="https://instagram.com/username"
            className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm"
          />
          <p className="text-[11px] text-muted-foreground mt-1.5">Link lengkap profil Instagram.</p>
        </div>

        {msg && (
          <div className="text-xs px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-foreground">
            {msg}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || loading}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold glow-purple-sm hover:-translate-y-0.5 transition disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
