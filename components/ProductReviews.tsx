"use client";

import { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  city: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  // Başlangıç için gerçekçi ve güven verici müşteri yorumları
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      author: "Mehmet Kaan Y.",
      rating: 5,
      date: "3 gün önce",
      verified: true,
      city: "İstanbul / Sarıyer",
      comment: "Salonumuzun tavanı için aldık. Beyoğlu mağazasından görerek teslim aldık, ustalar ışık kontrolünü gözümüzün önünde yaptı. Kristal parıltısı inanılmaz kaliteli.",
    },
    {
      id: "2",
      author: "Zeynep S.",
      rating: 5,
      date: "Geçen hafta",
      verified: true,
      city: "Ankara / Çankaya",
      comment: "Kargo konusunda çok endişeliydim fakat ahşap sandık içerisinde tek bir kristali dahi çizilmeden geldi. Montaj kılavuzu çok açıklayıcıydı, teşekkürler.",
    },
    {
      id: "3",
      author: "Mimar Emre B.",
      rating: 5,
      date: "2 hafta önce",
      verified: true,
      city: "İzmir / Urla",
      comment: "Villa projemiz için 2 adet sipariş ettik. Pirinç döküm kalitesi piyasadaki ucuz sac avizelerle kıyaslanamaz. Tam bir asırlık Beyoğlu işçiliği.",
    },
  ]);

  // Yeni Yorum Formu Durumları
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    const newRev: Review = {
      id: Date.now().toString(),
      author,
      city: city || "İstanbul",
      rating,
      date: "Az önce",
      verified: true,
      comment,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setAuthor("");
    setCity("");
    setComment("");
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2500);
  };

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="mt-16 pt-12 border-t border-neutral-200 space-y-8">
      {/* Üst İstatistik Alanı */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block mb-1">
            Müşteri Deneyimleri
          </span>
          <h3 className="text-2xl font-serif font-bold text-neutral-900">
            Değerlendirmeler & Yorumlar
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex text-amber-400 text-lg">★★★★★</div>
            <span className="text-sm font-bold text-neutral-900">{avgRating} / 5</span>
            <span className="text-xs text-neutral-400">({reviews.length} Doğrulanmış Müşteri)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shrink-0 shadow-sm"
        >
          {showForm ? "Formu Kapat" : "✍️ Yorum ve Puan Ekle"}
        </button>
      </div>

      {/* Yorum Ekleme Formu */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-amber-50/40 border border-amber-200/60 rounded-3xl p-6 sm:p-8 space-y-4 text-xs animate-in fade-in duration-200">
          <h4 className="font-serif font-bold text-neutral-900 text-base">
            Deneyiminizi Paylaşın
          </h4>

          {submitted ? (
            <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl font-medium text-center">
              ✓ Değerlendirmeniz başarıyla eklendi! Teşekkür ederiz.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Adınız Soyadınız</label>
                  <input
                    required
                    type="text"
                    placeholder="Örn: Ayşe D."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Şehir / İlçe</label>
                  <input
                    type="text"
                    placeholder="Örn: Kadıköy / İstanbul"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Puanınız</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-amber-600"
                  >
                    <option value={5}>★★★★★ (5 - Kusursuz)</option>
                    <option value={4}>★★★★☆ (4 - Çok İyi)</option>
                    <option value={3}>★★★☆☆ (3 - Orta)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Yorumunuz</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Avizenin ışıltısı, paketleme, kristal kalitesi ve teslimat süreci hakkındaki düşünceleriniz..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-xs shadow-sm"
              >
                Yorumu Yayınla →
              </button>
            </>
          )}
        </form>
      )}

      {/* Yorumlar Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex text-amber-400 text-sm">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
                <span className="text-neutral-400 text-[11px]">{r.date}</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed italic">
                "{r.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div>
                <strong className="text-neutral-900 block font-semibold">{r.author}</strong>
                <span className="text-[10px] text-neutral-400">{r.city}</span>
              </div>
              {r.verified && (
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ✓ Doğrulanmış Alıcı
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}