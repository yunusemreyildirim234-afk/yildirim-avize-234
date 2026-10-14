"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const { totalItems } = useCart();
  const { totalFavorites } = useWishlist();

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Üst Duyuru Çubuğu */}
      <div className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 text-center">
        <span>Işıltıyı yerinde keşfedin: </span>
        <strong className="text-amber-400">Beyoğlu Mağazamızdan Teslim Al</strong> seçeneği ile kargo beklemeden teslimat!
      </div>

      {/* Ana Menü */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-gray-900">
            YILDIRIM <span className="text-amber-600 font-sans font-light">AVİZE</span>
          </span>
        </Link>

        {/* Canlı Arama */}
        <div className="flex-1 max-w-xs sm:max-w-sm hidden md:block">
          <SearchBar />
        </div>

        {/* Kategoriler */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-gray-700">
          <Link href="/kategori/modern" className="hover:text-amber-600 transition-colors">
            Modern
          </Link>
          <Link href="/kategori/klasik" className="hover:text-amber-600 transition-colors">
            Klasik
          </Link>
          <Link href="/kategori/kristal" className="hover:text-amber-600 transition-colors">
            Kristal
          </Link>
          <Link href="/kategori/sarkit" className="hover:text-amber-600 transition-colors">
            Sarkıt
          </Link>
          <Link href="/iletisim" className="hover:text-amber-600 transition-colors text-amber-700 font-semibold">
            📍 Beyoğlu Mağaza
          </Link>
        </nav>

        {/* Sağ Butonlar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Favoriler Butonu */}
          <Link
            href="/favorilerim"
            className="flex items-center gap-1.5 text-neutral-700 hover:text-amber-600 text-xs font-medium px-3 py-2 rounded-full hover:bg-neutral-100 transition-colors"
            title="Favorilerim"
          >
            <span className="text-base text-red-500">♥</span>
            <span className="hidden sm:inline">Favoriler</span>
            {totalFavorites > 0 && (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalFavorites}
              </span>
            )}
          </Link>

          <Link
            href="/admin"
            className="text-xs font-semibold text-neutral-600 hover:text-amber-600 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors hidden sm:block"
          >
            ⚙️ Panel
          </Link>

          {/* Sepet Butonu */}
          <Link
            href="/sepet"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-full text-xs font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Sepet</span>
            <span className="bg-amber-500 text-neutral-950 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}