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

    // Use a truly unique channel name to avoid collisions, especially in Strict Mode
    const channelId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const channelName = `site-settings-realtime-${channelId}`;
    const channel = supabase.channel(channelName);

    channel
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        console.log(`[Realtime] ${channelName} changed, refetching...`);
        refetch();
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`[Realtime] Subscribed to ${channelName}`);
        }
        if (status === "CHANNEL_ERROR") {
          console.error(`[Realtime] Error subscribing to ${channelName}`);
        }
      });

    return () => {
      console.log(`[Realtime] Removing channel: ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading, refetch };
}
