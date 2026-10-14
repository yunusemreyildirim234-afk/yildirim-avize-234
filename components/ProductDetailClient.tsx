"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import ProductReviews from "@/components/ProductReviews";

interface Variation {
  id: string;
  variationType: string;
  variationValue: string;
  extraPrice: number;
  stock: number;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  basePrice: number;
  imageUrl?: string | null;
  variations: Variation[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    product.variations[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const currentPrice = product.basePrice + (selectedVariation?.extraPrice || 0);

  const handleAddToCart = () => {
    if (!selectedVariation) return;

    addToCart({
      productId: product.id,
      variationId: selectedVariation.id,
      title: product.title,
      variationName: `${selectedVariation.variationType}: ${selectedVariation.variationValue}`,
      price: currentPrice,
      quantity: quantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2">
      {/* Sol: Büyük Boy Gerçek Avize Fotoğraf Alanı */}
      <div className="relative min-h-[440px] bg-neutral-900 overflow-hidden flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-amber-400/80 p-8 text-center">
            <span className="text-4xl block mb-2">💡</span>
            <span className="text-xs uppercase tracking-widest text-neutral-400">Yıldırım Avize</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Beyoğlu Mağaza Rozeti */}
        <div className="absolute bottom-6 left-6 bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 text-neutral-200 text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Beyoğlu Mağazamızda Sergileniyor</span>
        </div>
      </div>

      {/* Sağ: Ürün Bilgileri ve Seçenekler */}
      <div className="p-8 sm:p-12 flex flex-col justify-between space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            {product.category} Serisi
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            {product.title}
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-4">
            <span className="text-xs text-neutral-400 block mb-1">Toplam Tutar</span>
            <span className="text-3xl font-bold text-neutral-900">
              {(currentPrice * quantity).toLocaleString("tr-TR")} ₺
            </span>
          </div>
        </div>

        {/* Varyasyon Seçimi */}
        {product.variations.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-neutral-100">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Seçenek Belirleyin:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {product.variations.map((v) => {
                const isSelected = selectedVariation?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariation(v)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/20"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="text-xs font-semibold text-neutral-900">
                      {v.variationValue}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {v.extraPrice > 0 ? `+${v.extraPrice} ₺` : "Fark Yok"}
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-1 font-medium">
                      Stok: {v.stock} adet
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Adet ve Sepete Ekleme */}
        <div className="space-y-4 pt-6 border-t border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 py-2.5 hover:bg-neutral-200 text-sm font-semibold transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-bold text-neutral-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3.5 py-2.5 hover:bg-neutral-200 text-sm font-semibold transition-colors"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-neutral-900 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm text-sm"
            >
              {addedToCart ? "✓ Sepete Eklendi!" : "Sepete Ekle"}
            </button>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
            <span className="text-base">📍</span>
            <div>
              <strong className="font-semibold">Beyoğlu Mağazasından Teslim Alabilirsiniz:</strong>
              <p className="text-neutral-600 mt-0.5">
                Kırılma riski olmadan mağazamızdan görerek teslim alma seçeneği mevcuttur.
              </p>
              {/* Kartın altına Yorumlar Modülü */}
      <div className="lg:col-span-2">
        <ProductReviews productId={product.id} />
      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}