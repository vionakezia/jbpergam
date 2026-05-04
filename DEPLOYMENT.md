# Deployment Guide - Vercel

## Environment Variables

Set these environment variables in Vercel Dashboard (Settings > Environment Variables):

| Variable                 | Description              | Example                                   |
| ------------------------ | ------------------------ | ----------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase project URL     | `https://xxx.supabase.co`                 |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbGciO..............................` |

### Cara Mendapatkan Supabase Credentials

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project kamu
3. Masuk ke **Settings > API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Deployment Steps

### Option 1: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel
```

### Option 2: Via Vercel Dashboard

1. Push code ke GitHub/GitLab/Bitbucket
2. Buka [Vercel Dashboard](https://vercel.com/dashboard)
3. Klik **Add New Project**
4. Import repository kamu
5. Vercel akan otomatis mendeteksi `vercel.json`
6. Set environment variables di Settings > Environment Variables
7. Klik **Deploy**

## Build Configuration

- **Build Command**: `bun run build`
- **Output Directory**: `dist`
- **Install Command**: `bun install`
- **Framework**: TanStack Start (Vite)

## Post-Deployment

1. Cek deployment logs di Vercel Dashboard
2. Test semua fitur di production URL
3. Pastikan Supabase realtime sudah enabled untuk tabel:
   - `products`
   - `rental_packages`
   - `product_images`
