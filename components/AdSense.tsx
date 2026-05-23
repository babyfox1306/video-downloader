"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

type AdBannerProps = {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
};

/** Loads AdSense script once (root layout). */
export function AdSenseScript() {
  if (!CLIENT) return null;

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

/** Responsive display ad unit — requires NEXT_PUBLIC_ADSENSE_CLIENT and slot env. */
export function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !slot || pushed.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* ignore if script not ready */
    }
  }, [slot]);

  if (!CLIENT || !slot) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div
          className={`min-h-[90px] rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-xs text-gray-400 ${className}`}
        >
          AdSense: đặt NEXT_PUBLIC_ADSENSE_CLIENT và slot trong .env.local
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
