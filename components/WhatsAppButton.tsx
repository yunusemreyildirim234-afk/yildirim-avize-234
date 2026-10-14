"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Gerçek WhatsApp İşletme Numaranız
  const phoneNumber = "905458126990";

  const isProductPage = pathname?.startsWith("/urun/");
  
  const defaultMessage = isProductPage
    ? `Merhaba Yıldırım Avize! İncelediğim bu avize modeli hakkında bilgi almak ve salonuma uygunluğunu danışmak istiyorum: ${typeof window !== "undefined" ? window.location.href : ""}`
    : "Merhaba Yıldırım Avize! Beyoğlu mağazanızdaki avize modelleriniz ve mekanım için aydınlatma danışmanlığı hakkında bilgi almak istiyorum.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {/* 3 Saniye Sonra Açılan Danışma Baloncuğu */}
      {isOpen && (
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-neutral-200 max-w-xs text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600 text-xs w-5 h-5 flex items-center justify-center rounded-full"
            title="Kapat"
          >
            ✕
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <strong className="text-neutral-900 font-semibold">Beyoğlu Mağaza Danışmanı</strong>
          </div>

          <p className="text-neutral-600 leading-relaxed text-[11px]">
            {isProductPage
              ? "Bu avizenin tavan yüksekliğinize veya salonunuza uygunluğunu ustalarımıza sormak ister misiniz?"
              : "Salonunuzun fotoğrafını atın, mekanınıza en uygun kristal veya modern avizeyi birlikte seçelim."}
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3 rounded-xl transition-colors text-[11px] shadow-sm"
          >
            WhatsApp'tan Fotoğraf Gönder →
          </a>
        </div>
      )}

      {/* Sabit Yeşil WhatsApp Butonu */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsOpen(true)}
        className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        title="WhatsApp'tan Danışın"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-white"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.204 8.204 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24h-.18zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
        </svg>
        <span className="hidden sm:inline font-semibold text-xs tracking-wide">
          Ustaya Danışın
        </span>
      </a>
    </div>
  );
}