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
[ ] Lainnya: \_\_\_

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
[ ] Tim — jumlah: \_\_\_

## Hosting & Infra

- Development: local
- Production: Vercel (Framework Preset: Other)

## Catatan Khusus

- Proyek menghasilkan output di folder `dist/client` dan `dist/server`.
- Deployment di Vercel menggunakan preset "Other" dengan build command `npm run build`.
- Masalah Realtime dan Line Endings (CRLF) telah diperbaiki pada Mei 2026.

## Progress Terakhir

- Memperbaiki error `cannot add callbacks` pada Supabase Realtime dengan menambahkan timestamp pada nama channel unik dan memperkuat logika cleanup.
- Refactor `useSiteSettings` dan `useProducts` untuk menggunakan sistem realtime yang lebih robust.
- Menyelesaikan masalah linting (Prettier) pada hook yang telah di-refactor.
- Memastikan build produksi berhasil tanpa error.

## Last Updated

2026-05-02
