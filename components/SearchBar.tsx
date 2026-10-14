"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  category: string;
  basePrice: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Müşteri yazdıkça arama yap
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250); // 250ms gecikme ile veritabanını yormayan akıllı sorgu

    return () => clearTimeout(timer);
  }, [query]);

  // Arama çubuğunun dışına tıklandığında menüyü kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-sm">
      <div className="relative">
        <input
          type="text"
          placeholder="Avize modeli, kristal, tarz ara..."
          value={query}
          onFocus={() => query.trim() && setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-neutral-100 text-neutral-800 placeholder-neutral-400 text-xs rounded-full pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:bg-white border border-transparent focus:border-amber-400 transition-all"
        />
        {/* Arama İkonu */}
        <span className="absolute left-3 top-2.5 text-neutral-400 text-xs">
          🔍
        </span>

        {/* Temizle Butonu */}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-2 text-neutral-400 hover:text-neutral-600 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Açılır Canlı Sonuç Kutusu */}
      {isOpen && (
        <div className="absolute top-11 left-0 right-0 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {loading ? (
            <div className="p-4 text-center text-xs text-neutral-400">
              Aranıyor...
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
              <div className="p-2.5 bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Eşleşen Avizeler ({results.length})
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/urun/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="p-3 flex items-center justify-between hover:bg-amber-50/50 transition-colors block"
                >
                  <div>
                    <h4 className="text-xs font-serif font-bold text-neutral-900">
                      {product.title}
                    </h4>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium inline-block mt-0.5">
                      {product.category}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neutral-800">
                    {product.basePrice.toLocaleString("tr-TR")} ₺
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-neutral-500">
              "{query}" ile eşleşen bir avize bulunamadı.
            </div>
          )}
        </div>
      )}
    </div>
  );
}