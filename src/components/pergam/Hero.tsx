export function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-24 md:pt-44 md:pb-36 overflow-hidden"
    >
      {/* glow blobs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-primary/20 blur-[140px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-primary-glow/20 blur-[100px] pointer-events-none animate-float" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-foreground/90 mb-8 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Trusted Marketplace · 2024
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Trusted Game Account
          <br />
          <span className="gradient-text text-glow">Rental & Stock</span>{" "}
          Marketplace
        </h1>

        <p
          className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Check availability of Free Fire, Mobile Legends, and rental accounts
          easily and quickly — semua dalam satu tempat aman.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#catalog"
            className="px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold glow-purple-sm hover:glow-purple transition-all hover:-translate-y-0.5"
          >
            Lihat Katalog
          </a>
          <a
            href="#contact"
            className="px-7 py-3.5 rounded-full border border-primary/40 bg-card/40 backdrop-blur-md font-semibold text-foreground hover:bg-primary/10 hover:border-primary transition-all"
          >
            Hubungi Kami
          </a>
        </div>

        <div
          className="mt-20 grid grid-cols-3 max-w-2xl mx-auto gap-4 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { v: "5K+", l: "Transaksi" },
            { v: "99%", l: "Kepuasan" },
            { v: "24/7", l: "Support" },
          ].map((s) => (
            <div
              key={s.l}
              className="card-surface rounded-2xl p-4 hover-lift"
            >
              <div className="font-display text-2xl md:text-3xl font-bold gradient-text">
                {s.v}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
