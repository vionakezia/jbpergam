import { useState } from "react";

const faqs = [
  {
    q: "How does account rental work?",
    a: "Pilih akun yang ingin disewa, lakukan pembayaran, lalu kami kirimkan detail login via WhatsApp. Akun bisa langsung digunakan sesuai durasi sewa.",
  },
  {
    q: "Is the account safe?",
    a: "Sangat aman. Semua akun terverifikasi, dilengkapi second-email/recovery agar pengguna tidak bisa mengubah data permanen. Garansi penuh selama masa sewa.",
  },
  {
    q: "How long is rental duration?",
    a: "Tersedia opsi sewa harian (1 hari) hingga mingguan (7 hari). Durasi dapat diperpanjang kapan saja sebelum waktu habis.",
  },
  {
    q: "What if there is a problem?",
    a: "Tim support kami online 24/7 di WhatsApp & Instagram. Setiap masalah teknis akan dibantu maksimal 15 menit.",
  },
  {
    q: "Is refund available?",
    a: "Ya. Refund 100% berlaku jika akun tidak bisa diakses karena kesalahan dari pihak kami. Lihat ketentuan lengkap saat checkout.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-primary mb-3">FAQ</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Pertanyaan yang sering ditanyakan
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`card-surface rounded-2xl overflow-hidden transition-all ${
                  isOpen ? "border-primary/60 glow-purple-sm" : ""
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                >
                  <span className="font-display font-semibold text-base md:text-lg">
                    {f.q}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full grid place-items-center border transition-all ${
                      isOpen
                        ? "bg-primary text-primary-foreground border-primary rotate-45"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
