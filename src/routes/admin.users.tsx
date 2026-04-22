import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

interface RoleRow {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

function AdminUsers() {
  const [admins, setAdmins] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const refresh = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("*")
      .eq("role", "admin")
      .order("created_at", { ascending: false });
    setAdmins((data ?? []) as RoleRow[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin/login` },
    });
    if (error || !data.user) {
      setSubmitting(false);
      setMessage({ type: "err", text: error?.message ?? "Gagal membuat akun" });
      return;
    }
    const { error: roleErr } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role: "admin" });
    setSubmitting(false);
    if (roleErr) {
      setMessage({ type: "err", text: "Akun dibuat tapi role gagal: " + roleErr.message });
      return;
    }
    setMessage({
      type: "ok",
      text: `Admin baru ditambahkan: ${email}. Email konfirmasi mungkin perlu diaktifkan.`,
    });
    setEmail("");
    setPassword("");
    refresh();
  };

  return (
    <div>
      <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground">
        ← Kembali
      </Link>
      <h1 className="font-display text-3xl font-bold mt-2 mb-6">Akun Admin</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-surface rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg mb-4">Tambah Admin Baru</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">
                Password (min 6 karakter)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mt-1"
              />
            </div>
            {message && (
              <div
                className={`text-sm rounded-xl px-4 py-2 ${
                  message.type === "ok"
                    ? "bg-primary/10 text-primary-glow border border-primary/30"
                    : "bg-destructive/10 text-destructive border border-destructive/30"
                }`}
              >
                {message.text}
              </div>
            )}
            <button
              disabled={submitting}
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? "Memproses..." : "Tambah Admin"}
            </button>
          </form>
        </div>

        <div className="card-surface rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg mb-4">Daftar Admin Aktif</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat...</p>
          ) : admins.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada admin.</p>
          ) : (
            <ul className="space-y-2">
              {admins.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border"
                >
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {a.user_id.slice(0, 8)}...
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Sejak {new Date(a.created_at).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                    admin
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
