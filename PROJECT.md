# Pergam Store

## Deskripsi
Marketplace untuk rental akun game dan stok akun (Free Fire, Mobile Legends). Proyek ini merupakan hasil clone dari jbpergam.

## Stack Teknologi
- Frontend: React 19 (via TanStack Start)
- Backend: Serverless (via TanStack Start SSR)
- Database: Supabase
- Styling: Tailwind CSS v4
- Auth: Supabase Auth
- Hosting: Vercel

## Mode Arsitektur
[x] TanStack Start Fullstack (SSR)
[ ] SPA Mode
[ ] Lainnya: ___

## Target Platform
[x] Web only
[ ] Mobile only
[ ] Web + Mobile

## Multi-tenant
[ ] Ya
[x] Tidak

## Skala User
[x] Kecil (< 100 user)
[ ] Menengah (< 10.000 user)
[ ] Besar (> 10.000 user)

## Tim
[x] Solo developer
[ ] Tim — jumlah: ___

## Hosting & Infra
- Development: local
- Production: Vercel (Framework Preset: Other)

## Catatan Khusus
- Proyek menghasilkan output di folder `dist/client` dan `dist/server`.
- Deployment di Vercel menggunakan preset "Other" dengan build command `npm run build`.
- Masalah Realtime dan Line Endings (CRLF) telah diperbaiki pada Mei 2026.

## Progress Terakhir
- Memperbaiki error `cannot add callbacks` pada Supabase Realtime dengan nama channel unik.
- Menambahkan manual `refetch()` pada aksi hapus produk dan simpan pengaturan sebagai fallback.
- Menyelaraskan format file ke Unix Line Endings (LF) untuk menghindari error ESLint.
- Konfigurasi deployment Vercel diperbarui (menggunakan preset Other).

## Last Updated
2026-05-02
