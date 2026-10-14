"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAddProduct() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kristal");
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");
  const [variationValue, setVariationValue] = useState("Parlak Gold");
  const [stock, setStock] = useState("10");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          basePrice,
          description,
          variationType: "Seçenek",
          variationValue,
          stock,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✓ Yeni avize başarıyla vitrine eklendi!");
        setTitle("");
        setBasePrice("");
        setDescription("");
        setOpen(false);
        router.refresh();
      } else {
        alert("Hata: " + data.error);
      }
    } catch {
      alert("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif font-bold text-neutral-900">
            Hızlı Ürün & Stok Girişi
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kataloğa tek tıkla yeni avize ve başlangıç stoğu ekleyin.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          {open ? "Formu Kapat" : "+ Yeni Avize Ekle"}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Avize Adı</label>
            <input
              required
              type="text"
              placeholder="Örn: Çırağan 12'li Sarkıt Avize"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-amber-600 bg-white"
            >
              <option value="Kristal">Kristal</option>
              <option value="Modern">Modern</option>
              <option value="Klasik">Klasik</option>
              <option value="Sarkıt">Sarkıt & Aplik</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Taban Satış Fiyatı (₺)</label>
            <input
              required
              type="number"
              placeholder="Örn: 6500"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Başlangıç Stoğu (Adet)</label>
            <input
              required
              type="number"
              placeholder="Örn: 15"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-neutral-700 block mb-1">Varsayılan Varyasyon / Renk</label>
            <input
              required
              type="text"
              placeholder="Örn: Eskitme Pirinç Kaplama"
              value={variationValue}
              onChange={(e) => setVariationValue(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-neutral-700 block mb-1">Ürün Açıklaması</label>
            <textarea
              rows={2}
              placeholder="Avizenin materyali, kullanım alanı ve ampul uyumluluğu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="sm:col-span-2 text-right pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Avizeyi Vitrinde Yayınla"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}   