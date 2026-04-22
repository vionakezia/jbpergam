import { useEffect, useMemo, useState } from "react";
import { products, type GameType, type Status } from "../../data/products";

type GameFilter = "all" | GameType;
type StatusFilter = "all" | "Ready" | "Not Available";
type SortBy = "newest" | "price-asc" | "price-desc";

interface Props {
  initialGame?: GameFilter;
}

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export function Catalog({ initialGame = "all" }: Props) {
  const [game, setGame] = useState<GameFilter>(initialGame);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortBy>("newest");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<(typeof products)[number] | null>(null);

  useEffect(() => {
    setGame(initialGame);
  }, [initialGame]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (game !== "all" && p.game !== game) return false;
      if (status !== "all" && p.status !== status) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.game.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }, [game, status, sort, query]);

  const games: { v: GameFilter; label: string }[] = [
    { v: "all", label: "All" },
    { v: "Free Fire", label: "Free Fire" },
    { v: "Mobile Legends", label: "Mobile Legends" },
    { v: "Rental", label: "Rental" },
  ];

  const statuses: { v: StatusFilter; label: string }[] = [
    { v: "all", label: "All Status" },
    { v: "Ready", label: "Ready Only" },
    { v: "Not Available", label: "Not Available" },
  ];

  const waLink = (p: (typeof products)[number]) =>
    `https://wa.me/6281234567890?text=${encodeURIComponent(
      `Halo Pergam Store, saya mau ${p.game === "Rental" ? "sewa" : "beli"}: ${p.name} (${formatIDR(p.price)})`,
    )}`;

  return (
    <section id="catalog" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-3">
              Katalog
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">
              Stock & Rental tersedia
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Filter, urutkan, dan cari akun yang kamu butuhkan secara realtime.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau game..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-3 mb-5">
          {games.map((g) => (
            <button
              key={g.v}
              onClick={() => setGame(g.v)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                game === g.v
                  ? "bg-primary text-primary-foreground border-primary glow-purple-sm"
                  : "bg-card/60 border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s.v}
                onClick={() => setStatus(s.v)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  status === s.v
                    ? "bg-primary/20 border-primary text-foreground"
                    : "bg-transparent border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortBy)}
              className="bg-card border border-border rounded-full px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="card-surface rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-semibold text-xl">Tidak ditemukan</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Coba ubah filter atau kata kunci pencarian.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onDetail={() => setDetail(p)}
                waLink={waLink(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detail && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center p-4 bg-background/80 backdrop-blur-sm animate-fade-up"
          onClick={() => setDetail(null)}
        >
          <div
            className="card-surface rounded-3xl max-w-md w-full p-8 relative glow-purple-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetail(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-muted hover:bg-primary/30 grid place-items-center"
              aria-label="Close"
            >
              ✕
            </button>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
              {detail.game}
            </span>
            <h3 className="font-display text-2xl font-bold mt-4">{detail.name}</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {detail.description}
            </p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Harga</div>
                <div className="font-display text-2xl font-bold gradient-text">
                  {formatIDR(detail.price)}
                </div>
              </div>
              <StatusBadge status={detail.status} />
            </div>
            <a
              href={waLink(detail)}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 block w-full text-center py-3 rounded-full font-semibold transition-all ${
                detail.status === "Ready"
                  ? "bg-primary text-primary-foreground hover:glow-purple-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
              }`}
            >
              {detail.game === "Rental" ? "Sewa Sekarang" : "Beli Sekarang"}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "Ready") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary-glow border border-primary/40 glow-purple-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-pulse" />
        Ready
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
      Not Available
    </span>
  );
}

function ProductCard({
  product,
  index,
  onDetail,
  waLink,
}: {
  product: (typeof products)[number];
  index: number;
  onDetail: () => void;
  waLink: string;
}) {
  const isReady = product.status === "Ready";
  return (
    <article
      className="card-surface rounded-2xl p-6 hover-lift flex flex-col animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
          {product.game}
        </span>
        <StatusBadge status={product.status} />
      </div>

      <h3 className="font-display font-semibold text-lg leading-snug">
        {product.name}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">
        {product.description}
      </p>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Harga
          </div>
          <div className="font-display text-xl font-bold gradient-text">
            {formatIDR(product.price)}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <a
          href={isReady ? waLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!isReady}
          className={`text-center text-sm font-semibold py-2.5 rounded-full transition-all ${
            isReady
              ? "bg-primary text-primary-foreground hover:glow-purple-sm"
              : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
          }`}
        >
          {product.game === "Rental" ? "Sewa" : "Beli"}
        </a>
        <button
          onClick={onDetail}
          className="text-sm font-semibold py-2.5 rounded-full border border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary transition-all"
        >
          Detail
        </button>
      </div>
    </article>
  );
}
