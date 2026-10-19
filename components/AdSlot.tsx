"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";

interface AdSlotProps {
  adSlot?: string;
  adFormat?: string;
  className?: string;
}

/**
 * Google AdSense ad unit component.
 * Place this between content sections in articles.
 * Uses the publisher id from SITE.adsenseClient.
 */
export default function AdSlot({
  adSlot,
  adFormat = "auto",
  className = "",
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* adsbygoogle not loaded yet */
    }
  }, []);

  const clientId = SITE.adsenseClient;

  if (!clientId || !adSlot) return null;

  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
