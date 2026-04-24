export function Contact() {
  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative card-surface rounded-3xl p-10 md:p-16 text-center overflow-hidden glow-purple-sm">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/30 blur-[140px] pointer-events-none" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-3">
              Kontak
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">
              Siap mulai? <span className="gradient-text text-glow">Order Sekarang</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Hubungi tim Pergam Store via WhatsApp untuk pesanan cepat, atau
              ikuti Instagram kami untuk info stock terbaru.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/6282312715218?text=Halo%2C%20Pergam%20Store!%20Saya%20ingin%20bertanya%20tentang%20produk%20Anda."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold glow-purple hover:animate-pulse-glow transition-all hover:-translate-y-0.5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-2C8.4 7.1 8.1 7 7.9 7h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.4.1.2 1.6 2.5 4 3.5.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.3-.1-.5-.1zm-5.5 7.3c-1.7 0-3.4-.5-4.9-1.4l-.4-.2-3.6.9.9-3.6-.2-.4c-1-1.5-1.5-3.3-1.5-5.1 0-5.4 4.4-9.7 9.7-9.7 2.6 0 5 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.8-.1 5.4-4.4 9.8-9.8 9.8zm8.3-18.1C18 1.5 15.1.4 12 .4 5.6.4.4 5.6.4 12c0 2 .5 4 1.5 5.7L.3 24l6.4-1.7c1.7.9 3.6 1.4 5.5 1.4 6.4 0 11.6-5.2 11.6-11.6.1-3.1-1.1-6-3.5-8.5z"/>
                </svg>
                Chat WhatsApp
              </a>
              <a
                href="https://instagram.com/rental.pergamff"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-primary/40 bg-card/40 backdrop-blur-md font-semibold hover:bg-primary/10 hover:border-primary transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.4A4 4 0 1112.6 8 4 4 0 0116 11.4z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Instagram
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground">
              © {new Date().getFullYear()} Pergam Store. Built with passion for gamers.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
