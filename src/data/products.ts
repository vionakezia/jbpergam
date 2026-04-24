export type GameType =
  | "Free Fire"
  | "Mobile Legends"
  | "Rental"
  | "JasaPost"
  | "Top Up";
export type Status = "Ready" | "Not Available";

export interface RentalPackage {
  id?: string;
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
  gallery?: string[];
}
