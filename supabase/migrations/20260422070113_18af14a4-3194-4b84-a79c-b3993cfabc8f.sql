DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;

CREATE POLICY "Admins can list product images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));