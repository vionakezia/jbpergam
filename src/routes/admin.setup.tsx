import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/setup")({
  head: () => ({
    meta: [
      { title: "Setup Admin Pertama — Pergam Store" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSetup,
});

function AdminSetup() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [email] = useState("ozinpergam29@gmail.com");
  const [password, setPassword] = useState("Ozin1234");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const { count } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      setHasAdmin((count ?? 0) > 0);
      setChecking(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { data, error: signErr } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin/login` },
    });
    if (signErr || !data.user) {
      setSubmitting(false);
      setError(signErr?.message ?? "Gagal membuat akun");
      return;
    }
    const { error: roleErr } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role: "admin" });
    setSubmitting(false);
    if (roleErr) {
      setError("Akun dibuat tapi role gagal disetel: " + roleErr.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate({ to: "/admin/login" }), 2000);
  };

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Memeriksa...
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="card-surface rounded-3xl p-8 max-w-md text-center">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="font-display font-bold text-xl">Setup sudah selesai</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Admin sudah ada di sistem. Halaman setup ini terkunci untuk keamanan.
          </p>
          <Link
            to="/admin/login"
            className="mt-5 inline-block px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
          >
            Ke Halaman Login →
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="card-surface rounded-3xl p-8 max-w-md text-center glow-purple-sm">
          <div className="text-4xl mb-3">🎉</div>
          <h1 className="font-display font-bold text-xl">Admin berhasil dibuat!</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Mengarahkan ke halaman login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-12">
      <div className="w-full max-w-md card-surface rounded-3xl p-8 glow-purple-sm">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🚀</div>
          <h1 className="font-display text-2xl font-bold">Setup Admin Pertama</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Buat akun admin pertama untuk mengelola Pergam Store. Email admin sudah
            dikunci ke <strong>ozinpergam29@gmail.com</strong>. Halaman ini akan
            terkunci otomatis setelah admin berhasil dibuat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              readOnly
              className="input mt-1 opacity-70 cursor-not-allowed"
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
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-2">
              {error}
            </div>
          )}
          <button
            disabled={submitting}
            className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold glow-purple-sm disabled:opacity-60"
          >
            {submitting ? "Memproses..." : "Buat Admin & Mulai"}
          </button>
        </form>
      </div>
    </div>
  );
}
