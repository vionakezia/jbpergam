import { useEffect, useState } from "react";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#catalog", label: "Katalog" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Kontak" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center glow-purple-sm group-hover:animate-pulse-glow">
            <span className="font-display font-bold text-primary-foreground">P</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Pergam<span className="gradient-text">Store</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:glow-purple-sm transition-all"
        >
          Order Sekarang
        </a>

        <button
          aria-label="Menu"
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block w-5 h-0.5 bg-foreground" />
            <span className="block w-5 h-0.5 bg-foreground" />
            <span className="block w-5 h-0.5 bg-foreground" />
          </div>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <ul className="px-6 py-4 space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  onClick={() => setOpen(false)}
                  href={l.href}
                  className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                onClick={() => setOpen(false)}
                href="#contact"
                className="block text-center mt-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium"
              >
                Order Sekarang
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
