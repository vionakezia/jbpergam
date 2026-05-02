import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  whatsappNumber: string;
  instagramUrl: string;
}

const DEFAULTS: SiteSettings = {
  whatsappNumber: "6282312715218",
  instagramUrl: "https://instagram.com/rental.pergamff",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("whatsapp_number, instagram_url")
      .maybeSingle();
    if (data) {
      setSettings({
        whatsappNumber: data.whatsapp_number ?? DEFAULTS.whatsappNumber,
        instagramUrl: data.instagram_url ?? DEFAULTS.instagramUrl,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    refetch();
    const channel = supabase
      .channel("site-settings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading, refetch };
}