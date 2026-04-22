export type GameType = "Free Fire" | "Mobile Legends" | "Rental" | "Top Up";
export type Status = "Ready" | "Not Available";

export interface RentalPackage {
  duration: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  game: GameType;
  price: number;
  status: Status;
  description: string;
  createdAt: number; // for "newest" sort
  image?: string;
  rentalPackages?: RentalPackage[];
}

import rentalCode004 from "../assets/rental-code-004.jpeg";
import stockFreeFire from "../assets/stock-free-fire.jpeg";

export const products: Product[] = [
  {
    id: "ff-001",
    name: "Stock Free Fire",
    game: "Free Fire",
    price: 0,
    status: "Ready",
    description:
      "Koleksi lengkap akun Free Fire premium — bundle eksklusif, skin senjata legendaris, dan bagde album lengkap. Pilihan terbaik untuk para sultan FF.",
    createdAt: 20250420,
    image: stockFreeFire,
  },
  {
    id: "rent-004",
    name: "CODE 004",
    game: "Rental",
    price: 60000,
    status: "Ready",
    description: "Cobain sensasi pakai akun epep ganteng!",
    createdAt: 20250420,
    image: rentalCode004,
    rentalPackages: [
      { duration: "6 Jam", price: 60000 },
      { duration: "12 Jam", price: 100000 },
      { duration: "24 Jam", price: 150000 },
    ],
  },
];
