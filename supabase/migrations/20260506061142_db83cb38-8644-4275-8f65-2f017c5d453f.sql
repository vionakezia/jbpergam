ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS tiktok_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS whatsapp_channel_url text NOT NULL DEFAULT '';