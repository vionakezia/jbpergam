interface Props {
  onSelect: (game: "all" | "Free Fire" | "Mobile Legends" | "Rental") => void;
}

const items = [
  {
    key: "Free Fire" as const,
    title: "Stock Free Fire",
    desc: "Akun premium dengan bundle eksklusif",
    icon: "🔥",
  },
  {
    key: "Mobile Legends" as const,
    title: "Stock Mobile Legends",
    desc: "Mythic Glory & full hero collection",
    icon: "⚔️",
  },
  {
    key: "Rental" as const,
    title: "Rental Akun",
    desc: "Sewa akun harian / mingguan aman",
    icon: "🎮",
  },
  {
    key: "topup" as const,
    title: "Top Up Games",
    desc: "Top up cepat lewat Pergam Shop",
    icon: "💎",
    external: "https://www.pergamshop.com",
  },
];

export function Categories({ onSelect }: Props) {
  const handle = (item: (typeof items)[number]) => {
    if (item.key === "topup") {
      window.open("https://www.pergamshop.com", "_blank", "noopener,noreferrer");
      return;
    }
    onSelect(item.key);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="categories" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-primary mb-3">
            Kategori
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Pilih kategori favoritmu
          </h2>
          <p className="mt-3 text-muted-foreground">
            Filter katalog cepat berdasarkan kebutuhan, atau langsung top-up
            game pilihanmu.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => handle(item)}
              className="text-left card-surface rounded-2xl p-6 hover-lift group relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/30 transition-all" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary-glow/20 grid place-items-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{item.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-primary group-hover:text-primary-glow transition-colors">
                  {item.key === "topup" ? "Buka Pergam Shop" : "Lihat stock"}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
