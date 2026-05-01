ALTER TYPE public.game_type ADD VALUE IF NOT EXISTS 'Partner Resmi Bang Pergam';
ALTER TYPE public.game_type ADD VALUE IF NOT EXISTS 'Paid Promote Bang Pergam';

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS whatsapp_number text;