export type GameType = "Free Fire" | "Mobile Legends" | "Rental";
export type Status = "Ready" | "Not Available";

export interface Product {
  id: string;
  name: string;
  game: GameType;
  price: number;
  status: Status;
  description: string;
  createdAt: number; // for "newest" sort
}

export const products: Product[] = [
  {
    id: "ff-001",
    name: "Akun Sultan FF — Bundle Lengkap",
    game: "Free Fire",
    price: 450000,
    status: "Ready",
    description: "Akun Free Fire grandmaster, full bundle Cobra & Booyah Pass aktif.",
    createdAt: 20250410,
  },
  {
    id: "ff-002",
    name: "Akun FF Diamond 10K+",
    game: "Free Fire",
    price: 180000,
    status: "Ready",
    description: "Stock akun dengan diamond melimpah, level 60+, siap pakai.",
    createdAt: 20250408,
  },
  {
    id: "ff-003",
    name: "Akun FF Heroic Murah",
    game: "Free Fire",
    price: 95000,
    status: "Not Available",
    description: "Rank Heroic, beberapa skin senjata permanen.",
    createdAt: 20250320,
  },
  {
    id: "ml-001",
    name: "Akun ML Mythic Glory",
    game: "Mobile Legends",
    price: 650000,
    status: "Ready",
    description: "Mythic Glory ★200+, 80+ hero, 120+ skin epic & legend.",
    createdAt: 20250415,
  },
  {
    id: "ml-002",
    name: "Akun ML Mythic Honor",
    game: "Mobile Legends",
    price: 320000,
    status: "Ready",
    description: "Mythic Honor, full hero, banyak skin epic terbaru.",
    createdAt: 20250412,
  },
  {
    id: "ml-003",
    name: "Akun ML Starter Mythic",
    game: "Mobile Legends",
    price: 150000,
    status: "Not Available",
    description: "Akun fresh Mythic, cocok untuk push rank cepat.",
    createdAt: 20250301,
  },
  {
    id: "rent-001",
    name: "Rental ML Mythic Glory — 1 Hari",
    game: "Rental",
    price: 25000,
    status: "Ready",
    description: "Sewa akun ML Mythic Glory untuk push rank atau farming.",
    createdAt: 20250418,
  },
  {
    id: "rent-002",
    name: "Rental Akun FF Sultan — 1 Hari",
    game: "Rental",
    price: 30000,
    status: "Ready",
    description: "Sewa akun FF full bundle, garansi aman dan privasi terjaga.",
    createdAt: 20250417,
  },
  {
    id: "rent-003",
    name: "Rental ML Mingguan",
    game: "Rental",
    price: 120000,
    status: "Not Available",
    description: "Paket sewa 7 hari, hemat untuk farming jangka panjang.",
    createdAt: 20250310,
  },
];
