"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  category: string;
  basePrice: number;
  imageUrl?: string | null;
  variations: Variation[];
}

export default function AdminProductList({ products }: { products: Product[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Stok Artır / Azalt
  const handleStockChange = async (variationId: string, newStock: number) => {
    setLoadingId(variationId);
    try {
      const res = await fetch("/api/admin/product", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variationId, stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert("Stok güncellenemedi: " + data.error);
      }
    } catch {
      alert("İşlem tamamlanamadı.");
    } finally {
      setLoadingId(null);
    }
  };

  // Ürünü Sil
  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!confirm(`"${title}" modelini katalogdan tamamen silmek istediğinize emin misiniz?`)) {
      return;
    }

    setLoadingId(productId);
    try {
      const res = await fetch("/api/admin/product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✓ Avize katalogdan silindi.");
        router.refresh();
      } else {
        alert("Silinemedi: " + data.error);
      }
    } catch {
      alert("İşlem tamamlanamadı.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif font-bold text-neutral-900">
            Avize Kataloğu & Stok Yönetimi
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Mevcut avizelerin varyasyon stoklarını canlı artırıp azaltabilir veya modeli silebilirsiniz.
          </p>
        </div>
        <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg">
          Toplam {products.length} Model
        </span>
      </div>

      <div className="divide-y divide-neutral-100">
        {products.map((product) => (
          <div key={product.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
            {/* Sol: Görsel ve Başlık */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-200">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-400 text-xs font-serif">💡</div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <h3 className="font-serif font-bold text-neutral-900 text-sm mt-0.5">
                  {product.title}
                </h3>
                <span className="text-xs font-semibold text-neutral-600">
                  {product.basePrice.toLocaleString("tr-TR")} ₺
                </span>
              </div>
            </div>

            {/* Orta: Varyasyonlar ve Stok Butonları */}
            <div className="flex flex-wrap items-center gap-3">
              {product.variations.map((v) => (
                <div key={v.id} className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 flex items-center gap-3 text-xs shadow-2xs">
                  <div>
                    <span className="font-medium text-neutral-700 block text-[11px]">{v.variationValue}</span>
                    <span className="text-[10px] text-neutral-400">Stok: <strong className="text-neutral-900">{v.stock}</strong></span>
                  </div>

                  <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      disabled={loadingId === v.id || v.stock <= 0}
                      onClick={() => handleStockChange(v.id, v.stock - 1)}
                      className="px-2 py-0.5 hover:bg-neutral-100 text-neutral-600 font-bold disabled:opacity-40"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      disabled={loadingId === v.id}
                      onClick={() => handleStockChange(v.id, v.stock + 1)}
                      className="px-2 py-0.5 hover:bg-neutral-100 text-neutral-600 font-bold disabled:opacity-40 border-l border-neutral-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sağ: Ürünü Sil Butonu */}
            <button
              type="button"
              disabled={loadingId === product.id}
              onClick={() => handleDeleteProduct(product.id, product.title)}
              className="text-neutral-400 hover:text-red-600 text-xs font-medium p-2 rounded-lg hover:bg-red-50 transition-colors self-end md:self-center"
              title="Avizeyi Katalogdan Sil"
            >
              🗑️ Modeli Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}