import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "../components/pergam/Navbar";
import { Hero } from "../components/pergam/Hero";
import { Categories } from "../components/pergam/Categories";
import { Catalog } from "../components/pergam/Catalog";
import { Faq } from "../components/pergam/Faq";
import { Contact } from "../components/pergam/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pergam Store — Game Account Rental & Stock Marketplace" },
      {
        name: "description",
        content:
          "Marketplace terpercaya untuk stock akun Free Fire, Mobile Legends, dan rental akun. Cek stock cepat, transaksi aman 24/7.",
      },
      { property: "og:title", content: "Pergam Store — Game Marketplace" },
      {
        property: "og:description",
        content: "Stock Free Fire, Mobile Legends & Rental Akun terpercaya.",
      },
    ],
  }),
  component: Index,
});

type GameFilter = "all" | "Free Fire" | "Mobile Legends" | "Rental";

function Index() {
  const [activeGame, setActiveGame] = useState<GameFilter>("all");

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Categories onSelect={setActiveGame} />
        <Catalog initialGame={activeGame} />
        <Faq />
        <Contact />
      </main>
    </div>
  );
}
