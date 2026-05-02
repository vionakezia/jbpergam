-- Site-wide settings (WhatsApp number, Instagram URL)
CREATE TABLE public.site_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  whatsapp_number TEXT NOT NULL DEFAULT '6282312715218',
  instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/rental.pergamff',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = TRUE)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are publicly viewable"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_settings_set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id) VALUES (TRUE) ON CONFLICT DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;