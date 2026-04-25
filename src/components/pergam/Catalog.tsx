import { useEffect, useMemo, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import type { GameType, Status, Product } from "../../data/products";

type GameFilter = "all" | GameType;
type StatusFilter = "all" | "Ready" | "Not Available";
type SortBy = "newest" | "price-asc" | "price-desc";

interface Props {
  initialGame?: GameFilter;
}

const WA_NUMBER = "6282312715218";
const TOPUP_URL = "https://www.pergamshop.com";

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const buildWaLink = (p: Product) => {
  const action = p.game === "Rental" ? "menyewa" : "membeli";
  const msg = `Halo, Pergam Store! Saya berminat untuk ${action} ${p.name}. Mohon segera diproses, ya!`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export function Catalog({ initialGame = "all" }: Props) {
  const { products, loading } = useProducts();
  const [game, setGame] = useState<GameFilter>(initialGame);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortBy>("newest");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Product | null>(null);
  const [zoomImage, setZoomImage] = useState<{ src: string; name: string } | null>(null);

  useEffect(() => {
    setGame(initialGame);
  }, [initialGame]);

  const filtered = useMemo(() => {
    if (game === "Top Up") return [];
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
  }, [products, game, status, sort, query]);

  const games: { v: GameFilter; label: string }[] = [
    { v: "all", label: "All" },
    { v: "Free Fire", label: "Free Fire" },
    { v: "Mobile Legends", label: "Mobile Legends" },
    { v: "Rental", label: "Rental" },
    { v: "JasaPost", label: "JasaPost" },
    { v: "Top Up", label: "Top Up" },
  ];

  const statuses: { v: StatusFilter; label: string }[] = [
    { v: "all", label: "All Status" },
    { v: "Ready", label: "Ready Only" },
    { v: "Not Available", label: "Not Available" },
  ];

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

        {/* Top Up CTA */}
        {game === "Top Up" ? (
          <div className="card-surface rounded-3xl p-10 md:p-16 text-center glow-purple-sm relative overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[140px] pointer-events-none" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-3xl mb-6 glow-purple-sm">
                💎
              </div>
              <h3 className="font-display text-2xl md:text-4xl font-bold">
                Top Up Games <span className="gradient-text">Cepat & Aman</span>
              </h3>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Layanan top up tersedia langsung di Pergam Shop. Diamond, UC, dan
                berbagai voucher game lainnya.
              </p>
              <a
                href={TOPUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold glow-purple hover:-translate-y-0.5 transition-all"
              >
                Buka Pergam Shop
                <span>→</span>
              </a>
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-surface rounded-2xl p-4 animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-muted/40 mb-4" />
                <div className="h-3 w-1/3 bg-muted/40 rounded mb-2" />
                <div className="h-4 w-2/3 bg-muted/40 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-surface rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-semibold text-xl">Belum ada produk</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Stock untuk kategori ini sedang kosong. Silakan cek kategori lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onDetail={() => setDetail(p)}
                onZoom={(src) => setZoomImage({ src, name: p.name })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detail && (
        <DetailModal
          product={detail}
          onClose={() => setDetail(null)}
          onZoom={(src) => setZoomImage({ src, name: detail.name })}
        />
      )}

      {/* Zoom image modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center p-4 bg-background/90 backdrop-blur-md animate-fade-up"
          onClick={() => setZoomImage(null)}
        >
          <button
            onClick={() => setZoomImage(null)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-card border border-border hover:bg-primary/30 grid place-items-center text-lg z-10"
            aria-label="Close"
          >
            ✕
          </button>
          <div
            className="max-w-4xl max-h-[90vh] overflow-auto rounded-2xl glow-purple-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomImage.src}
              alt={zoomImage.name}
              className="w-full h-auto block"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "Ready") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/20 text-primary-glow border border-primary/40 glow-purple-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-pulse" />
        Ready
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
      N/A
    </span>
  );
}

function ProductCard({
  product,
  index,
  onDetail,
  onZoom,
}: {
  product: Product;
  index: number;
  onDetail: () => void;
  onZoom: (src: string) => void;
}) {
  const isReady = product.status === "Ready";
  const hasPackages = !!product.rentalPackages?.length;
  const displayPrice =
    product.price > 0
      ? formatIDR(product.price)
      : hasPackages
      ? `Mulai ${formatIDR(product.rentalPackages![0].price)}`
      : "Hubungi";

  return (
    <article
      className="card-surface rounded-2xl p-3 md:p-4 hover-lift flex flex-col animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* 3:4 product image */}
      {product.image ? (
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <button
            onClick={() => onZoom(product.image!)}
            aria-label="Zoom image"
            className="absolute bottom-2 right-2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-background/80 backdrop-blur-md border border-primary/40 grid place-items-center hover:bg-primary hover:text-primary-foreground transition-all glow-purple-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative w-full aspect-[3/4] rounded-xl mb-3 bg-muted/40 grid place-items-center text-muted-foreground text-3xl">
          🎮
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 truncate">
          {product.game}
        </span>
        <StatusBadge status={product.status} />
      </div>

      <h3 className="font-display font-semibold text-sm md:text-base leading-snug line-clamp-1">
        {product.name}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">
        {product.description}
      </p>

      <div className="mt-3">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
          Harga
        </div>
        <div className="font-display text-sm md:text-base font-bold gradient-text leading-tight">
          {displayPrice}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        <a
          href={isReady ? buildWaLink(product) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!isReady}
          className={`text-center text-xs font-semibold py-2 rounded-full transition-all ${
            isReady
              ? "bg-primary text-primary-foreground hover:glow-purple-sm"
              : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
          }`}
        >
          {product.game === "Rental" ? "Sewa" : "Beli"}
        </a>
        <button
          onClick={onDetail}
          className="text-xs font-semibold py-2 rounded-full border border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary transition-all"
        >
          Detail
        </button>
      </div>
    </article>
  );
}

function DetailModal({
  product,
  onClose,
  onZoom,
}: {
  product: Product;
  onClose: () => void;
  onZoom: (src: string) => void;
}) {
  const hasPackages = !!product.rentalPackages?.length;
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.gallery ?? []),
  ];
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center p-4 bg-background/80 backdrop-blur-sm animate-fade-up overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="card-surface rounded-3xl max-w-md w-full p-8 relative glow-purple-sm my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-muted hover:bg-primary/30 grid place-items-center"
          aria-label="Close"
        >
          ✕
        </button>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
          {product.game}
        </span>
        <h3 className="font-display text-2xl font-bold mt-4">{product.name}</h3>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {product.description}
        </p>

        {allImages.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {allImages.slice(0, 8).map((src, i) => (
              <button
                key={i}
                onClick={() => onZoom(src)}
                className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {hasPackages ? (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✨</span>
              <h4 className="font-display font-bold text-lg gradient-text">
                Paket Hemat
              </h4>
              <span className="text-xl">✨</span>
            </div>
            <div className="space-y-2.5">
              {product.rentalPackages!.map((pkg) => (
                <div
                  key={pkg.duration}
                  className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-primary/10 border border-primary/30 hover:border-primary/60 hover:bg-primary/15 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 grid place-items-center text-sm">
                      ⏱️
                    </div>
                    <span className="font-display font-semibold">
                      {pkg.duration}
                    </span>
                  </div>
                  <span className="font-display font-bold text-primary-glow">
                    {formatIDR(pkg.price)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 text-center">
              Hubungi admin untuk pilih paket sesuai kebutuhanmu.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Harga</div>
              <div className="font-display text-2xl font-bold gradient-text">
                {product.price > 0 ? formatIDR(product.price) : "Hubungi Admin"}
              </div>
            </div>
            <StatusBadge status={product.status} />
          </div>
        )}

        <a
          href={buildWaLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-6 block w-full text-center py-3 rounded-full font-semibold transition-all ${
            product.status === "Ready"
              ? "bg-primary text-primary-foreground hover:glow-purple-sm"
              : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
          }`}
        >
          {product.game === "Rental" ? "Sewa Sekarang" : "Beli Sekarang"}
        </a>
      </div>
    </div>
  );
}
