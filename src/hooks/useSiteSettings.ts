import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  whatsappNumber: string;
  whatsappNumber2: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappChannelUrl: string;
}

const DEFAULTS: SiteSettings = {
  whatsappNumber: "6282312715218",
  whatsappNumber2: "",
  instagramUrl: "https://instagram.com/rental.pergamff",
  tiktokUrl: "",
  whatsappChannelUrl: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("whatsapp_number, instagram_url, tiktok_url, whatsapp_channel_url, whatsapp_number_2")
      .maybeSingle();
    if (data) {
      setSettings({
        whatsappNumber: data.whatsapp_number ?? DEFAULTS.whatsappNumber,
        whatsappNumber2: (data as any).whatsapp_number_2 ?? "",
        instagramUrl: data.instagram_url ?? DEFAULTS.instagramUrl,
        tiktokUrl: (data as any).tiktok_url ?? "",
        whatsappChannelUrl: (data as any).whatsapp_channel_url ?? "",
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
