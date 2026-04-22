import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Pergam Store" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLogin) return;
    if (!user) {
      navigate({ to: "/admin/login" });
    }
  }, [user, loading, navigate, isLogin]);

  if (isLogin) return <Outlet />;

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground text-sm">
        Memuat...
      </div>
    );
  }

  if (!user) return null;

  if (isAdmin === false) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="card-surface rounded-2xl p-8 max-w-md text-center">
          <h1 className="font-display text-xl font-bold mb-2">Akses Ditolak</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Akun Anda terdaftar tetapi tidak memiliki role admin.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin/login" });
            }}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
                <span className="font-display font-bold text-sm text-primary-foreground">P</span>
              </div>
              <span className="font-display font-bold">Admin Pergam</span>
            </Link>
            <span className="hidden md:inline text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
              Live
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Lihat Website ↗
            </a>
            <span className="hidden md:inline text-xs text-muted-foreground">{user.email}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/admin/login" });
              }}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
