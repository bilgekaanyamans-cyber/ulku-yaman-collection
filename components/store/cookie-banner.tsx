"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = document.cookie.includes("cookie_consent=true");
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    document.cookie = "cookie_consent=true;max-age=31536000;path=/";
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#1a1a1a] text-white px-5 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
      <p className="text-sm text-white/80 max-w-2xl">
        Bu web sitesi deneyiminizi iyileştirmek için çerezler kullanmaktadır.
        Detaylı bilgi için{" "}
        <Link href="/cerez-politikasi" className="underline text-white">çerez politikamızı</Link> inceleyebilirsiniz.
      </p>
      <div className="flex gap-3 flex-shrink-0">
        <button onClick={accept} className="px-6 py-2.5 bg-white text-[#1a1a1a] text-xs tracking-wide uppercase hover:bg-white/90 transition-colors">
          Kabul Et
        </button>
        <button onClick={() => setShow(false)} className="px-6 py-2.5 border border-white/30 text-xs tracking-wide uppercase hover:bg-white/10 transition-colors">
          Reddet
        </button>
      </div>
    </div>
  );
}
