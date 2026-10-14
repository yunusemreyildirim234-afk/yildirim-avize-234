"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

export default function FavorilerimPage() {
  const { favorites, toggleFavorite } = useWishlist();

  if (favorites.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-50 py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <span className="text-5xl block">♡</span>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Favori Listeniz Boş
          </h2>
          <p className="text-sm text-neutral-500">
            Beğendiğiniz avizeleri daha sonra incelemek ve karşılaştırmak için favorilerinize ekleyebilirsiniz.
          </p>
          <Link
            href="/"
            className="inline-block bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors mt-4"
          >
            Koleksiyonu Keşfet →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-5 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block mb-1">
              Kaydettiğiniz Avizeler
            </span>
            <h1 className="text-3xl font-serif font-bold text-neutral-900">
              Favorilerim
            </h1>
          </div>
          <span className="text-xs font-medium text-neutral-500">
            Toplam {favorites.length} avize kaydedildi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div className="h-60 bg-neutral-900 relative overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-amber-400 text-xs">
                    💡 Yıldırım Avize
                  </div>
                )}

                <span className="absolute top-3 left-3 bg-white/95 text-neutral-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {product.category}
                </span>

                {/* Favoriden Kaldır Butonu */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90"
                  title="Favorilerden Kaldır"
                >
                  ❤️
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <h3 className="font-serif font-bold text-neutral-900 text-base">
                  {product.title}
                </h3>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-base font-bold text-neutral-900">
                    {product.basePrice.toLocaleString("tr-TR")} ₺
                  </span>

                  <Link
                    href={`/urun/${product.id}`}
                    className="bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    İncele →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}