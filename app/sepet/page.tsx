"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  // 1. Teslimat Yöntemi
  const [shippingType, setShippingType] = useState<string>("BEYOGLU_MAGAZA_TESLIM");

  // 2. Ödeme Yöntemi
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "BANK_TRANSFER">("CREDIT_CARD");

  // 3. Taksit Seçimi
  const [installment, setInstallment] = useState<number>(1);

  // 4. Kupon Kodu Yönetimi
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: "percent" | "fixed"; value: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // 5. Kredi Kartı Bilgileri
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // 6. Müşteri İletişim Bilgileri
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [orderCompleteId, setOrderCompleteId] = useState<string | null>(null);

  // Kargo Hesaplama
  const shippingCost = shippingType === "BEYOGLU_MAGAZA_TESLIM" ? 0 : 250;
  const subTotalWithShipping = totalPrice + shippingCost;

  // Kupon İndirimi Hesaplama
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      couponDiscount = Math.round((totalPrice * appliedCoupon.value) / 100);
    } else {
      couponDiscount = Math.min(totalPrice, appliedCoupon.value);
    }
  }

  // Havale İndirimi (%5 - Kupon düşüldükten sonra)
  const afterCouponTotal = Math.max(0, subTotalWithShipping - couponDiscount);
  const bankDiscount = paymentMethod === "BANK_TRANSFER" ? Math.round(afterCouponTotal * 0.05) : 0;
  const finalTotal = Math.max(0, afterCouponTotal - bankDiscount);

  // Taksit aylık tutarı
  const monthlyAmount = Math.round(finalTotal / installment);

  // Kupon Uygulama Fonksiyonu
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponInput.trim().toUpperCase();

    if (code === "BEYOGLU10") {
      setAppliedCoupon({ code: "BEYOGLU10", type: "percent", value: 10 });
    } else if (code === "YILDIRIM15") {
      setAppliedCoupon({ code: "YILDIRIM15", type: "percent", value: 15 });
    } else if (code === "USTA500") {
      setAppliedCoupon({ code: "USTA500", type: "fixed", value: 500 });
    } else {
      setCouponError("Geçersiz veya süresi dolmuş kupon kodu.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    setExpiry(raw);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          shippingType,
          items: cart,
          totalAmount: finalTotal,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderCompleteId(data.orderId);
        clearCart();
      } else {
        alert("Sipariş oluşturulamadı: " + data.error);
      }
    } catch {
      alert("Bir bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (orderCompleteId) {
    return (
      <main className="min-h-screen bg-neutral-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h1 className="text-3xl font-serif font-bold text-neutral-900">
            Ödemeniz Onaylandı!
          </h1>
          <p className="text-sm text-neutral-600">
            Sayın <strong>{name}</strong>, siparişiniz başarıyla alındı ve atölyemize iletildi.
          </p>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-xs text-left space-y-2.5">
            <div>
              <span className="text-neutral-400">Sipariş Takip Kodu:</span>
              <p className="font-mono font-bold text-neutral-800 break-all">{orderCompleteId}</p>
            </div>
            {appliedCoupon && (
              <div>
                <span className="text-neutral-400">Uygulanan Kupon:</span>
                <p className="font-bold text-emerald-700">{appliedCoupon.code} (-{couponDiscount.toLocaleString("tr-TR")} ₺)</p>
              </div>
            )}
            <div className="pt-2 border-t border-neutral-200">
              <span className="text-neutral-400">Ödeme Detayı:</span>
              <p className="font-semibold text-neutral-800">
                {paymentMethod === "CREDIT_CARD"
                  ? `💳 Kredi Kartı (${installment > 1 ? `${installment} Taksit x${monthlyAmount.toLocaleString("tr-TR")} ₺` : "Tek Çekim"})`
                  : "🏦 Havale / EFT (%5 İndirimli)"}
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-200">
              <span className="text-neutral-400">Teslimat Yöntemi:</span>
              <p className="font-semibold text-neutral-800">
                {shippingType === "BEYOGLU_MAGAZA_TESLIM"
                  ? "📍 Beyoğlu Şişhane Mağazamızdan Teslim Alınacak"
                  : "📦 Sigortalı Ahşap Sandık Kargo ile Adresinize Gönderilecek"}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Alışverişe Devam Et →
          </Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-50 py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <span className="text-5xl block">🛍️</span>
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Sepetiniz Henüz Boş
          </h2>
          <p className="text-sm text-neutral-500">
            Beyoğlu koleksiyonumuzun kristal ve modern avizelerini keşfedin.
          </p>
          <Link
            href="/"
            className="inline-block bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors mt-4"
          >
            Koleksiyonu İncele →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-8">
          Alışveriş Sepeti & Güvenli Ödeme
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ürün Listesi */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.variationId}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div>
                    <h3 className="font-serif font-bold text-neutral-900 text-base">
                      {item.title}
                    </h3>
                    <span className="inline-block text-xs bg-amber-50 text-amber-800 font-medium px-2.5 py-0.5 rounded-md mt-1">
                      {item.variationName}
                    </span>
                    <div className="text-sm font-bold text-neutral-900 mt-2">
                      {item.price.toLocaleString("tr-TR")} ₺
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-neutral-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variationId, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs font-bold hover:bg-neutral-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variationId, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs font-bold hover:bg-neutral-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.variationId)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1 text-sm"
                      title="Kaldır"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* KUPON KODU GİRİŞ KUTUSU */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm space-y-3">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                İndirim / Kupon Kodu:
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <span className="text-base">✓</span>
                    <span>
                      <strong>{appliedCoupon.code}</strong> kuponu uygulandı:{" "}
                      <strong>
                        {appliedCoupon.type === "percent" ? `%${appliedCoupon.value} İndirim` : `${appliedCoupon.value} ₺ İndirim`}
                      </strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Kuponu Kaldır
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Örn: BEYOGLU10 veya YILDIRIM15"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 text-xs p-3 rounded-xl border border-neutral-300 font-mono uppercase focus:outline-none focus:border-amber-600"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shrink-0"
                  >
                    Kuponu Uygula
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-xs text-red-600 font-medium">{couponError}</p>
              )}
            </div>

            {/* Teslimat Tercihi */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-3 shadow-sm">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                Teslimat Yöntemini Seçin:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setShippingType("BEYOGLU_MAGAZA_TESLIM")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingType === "BEYOGLU_MAGAZA_TESLIM"
                      ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                    <span>📍 Beyoğlu Mağaza Teslimi</span>
                    <span className="text-emerald-600 font-bold">Ücretsiz</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Şişhane atölyemizden görerek teslimat. Kırılma riski sıfır.
                  </p>
                </div>

                <div
                  onClick={() => setShippingType("STANDART_KARGO")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingType === "STANDART_KARGO"
                      ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                    <span>📦 Özel Ahşap Sandık Kargo</span>
                    <span className="text-neutral-700 font-bold">250 ₺</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Kırılmalara karşı ahşap korumalı sandıkta sigortalı teslimat.
                  </p>
                </div>
              </div>
            </div>

            {/* Ödeme Bilgileri */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="text-lg font-serif font-bold text-neutral-900">
                    Ödeme Bilgileri
                  </h2>
                  <p className="text-xs text-neutral-500">
                    256-Bit SSL ve 3D Secure korumalı güvenli ödeme
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
                  <span className="bg-neutral-100 px-2 py-1 rounded text-[10px] text-neutral-600">troy</span>
                  <span className="bg-neutral-100 px-2 py-1 rounded text-[10px] text-neutral-600">VISA</span>
                  <span className="bg-neutral-100 px-2 py-1 rounded text-[10px] text-neutral-600">mastercard</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CREDIT_CARD")}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    paymentMethod === "CREDIT_CARD"
                      ? "border-amber-600 bg-amber-50/60 text-amber-950 ring-2 ring-amber-600/20"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  💳 Kredi / Banka Kartı
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-amber-600 bg-amber-50/60 text-amber-950 ring-2 ring-amber-600/20"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  🏦 Havale / EFT (%5 İndirimli)
                </button>
              </div>

              {paymentMethod === "CREDIT_CARD" ? (
                <div className="space-y-5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-neutral-700 block mb-1">Kart Numarası</label>
                      <input
                        required
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full p-3 rounded-xl border border-neutral-300 font-mono focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">Kart Üzerindeki İsim</label>
                      <input
                        required
                        type="text"
                        placeholder="Örn: YUNUS EMRE YILDIRIM"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">Son Kullanma</label>
                        <input
                          required
                          type="text"
                          placeholder="AA/YY"
                          value={expiry}
                          onChange={handleExpiryChange}
                          className="w-full p-3 rounded-xl border border-neutral-300 text-center font-mono focus:outline-none focus:border-amber-600"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">CVC / CVV</label>
                        <input
                          required
                          type="password"
                          maxLength={3}
                          placeholder="•••"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                          className="w-full p-3 rounded-xl border border-neutral-300 text-center font-mono focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Taksit Seçenekleri */}
                  <div className="space-y-2 pt-4 border-t border-neutral-100">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                      Taksit Seçenekleri (Bonus, World, Maximum, Axess):
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { count: 1, label: "Tek Çekim", note: "Peşin" },
                        { count: 3, label: "3 Taksit", note: "Vade Farksız" },
                        { count: 6, label: "6 Taksit", note: "Avantajlı" },
                        { count: 9, label: "9 Taksit", note: "Taksitli" },
                      ].map((t) => (
                        <div
                          key={t.count}
                          onClick={() => setInstallment(t.count)}
                          className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                            installment === t.count
                              ? "border-amber-600 bg-amber-50/70 text-amber-950 font-bold ring-2 ring-amber-600/20"
                              : "border-neutral-200 hover:border-neutral-300 bg-white"
                          }`}
                        >
                          <div className="text-xs font-bold">{t.label}</div>
                          <div className="text-[11px] text-amber-700 mt-0.5">
                            {Math.round(finalTotal / t.count).toLocaleString("tr-TR")} ₺ / ay
                          </div>
                          <div className="text-[9px] text-neutral-400 mt-1 uppercase font-semibold">
                            {t.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-xs text-amber-950 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🏦</span>
                    <span>Banka Havalesi / EFT Bilgileri:</span>
                  </div>
                  <p className="text-neutral-600">
                    Sipariş onayından sonra tarafınıza iletilecek IBAN numarasına ödeme yapabilirsiniz.
                  </p>
                  <div className="font-semibold text-emerald-700 pt-1">
                    ✓ Havale ödemelerinde %5 nakit indirimi otomatik uygulanmıştır.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon: Özet */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm h-fit">
            <h2 className="text-lg font-serif font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Sipariş Özeti
            </h2>

            <form onSubmit={handleCheckout} className="space-y-3">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                Teslimat & Fatura Bilgileri:
              </label>

              <input
                required
                type="text"
                placeholder="Adınız Soyadınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
              />
              <input
                required
                type="email"
                placeholder="E-posta Adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
              />
              <input
                required
                type="tel"
                placeholder="Telefon Numaranız"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
              />
              <textarea
                required
                rows={2}
                placeholder="Teslimat Adresiniz / Açık Adres"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
              />

              {/* Fiyat Dökümü */}
              <div className="space-y-2 pt-4 border-t border-neutral-100 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Ürünler Toplamı</span>
                  <span>{totalPrice.toLocaleString("tr-TR")} ₺</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Kargo / Teslimat</span>
                  <span>{shippingCost === 0 ? "Ücretsiz" : `${shippingCost} ₺`}</span>
                </div>

                {/* Kupon İndirimi */}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Kupon ({appliedCoupon?.code})</span>
                    <span>-{couponDiscount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                )}

                {/* Havale İndirimi */}
                {bankDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Havale İndirimi (%5)</span>
                    <span>-{bankDiscount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Toplam Tutar</span>
                  <span className="text-amber-600 text-base">{finalTotal.toLocaleString("tr-TR")} ₺</span>
                </div>

                {paymentMethod === "CREDIT_CARD" && installment > 1 && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg text-center font-medium">
                    💳 {installment} Taksit x <strong>{monthlyAmount.toLocaleString("tr-TR")} ₺ / ay</strong>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-neutral-900 hover:bg-amber-600 text-white py-3.5 px-4 rounded-xl transition-colors text-xs font-semibold shadow-sm mt-4 disabled:opacity-50"
              >
                {loading
                  ? "İşlem Güvenli Şekilde Yapılıyor..."
                  : `🔒 ${finalTotal.toLocaleString("tr-TR")} ₺ Güvenli Öde`}
              </button>

              <div className="text-center pt-2 text-[10px] text-neutral-400">
                🔒 256-Bit SSL Sertifikalı Güvenli Ödeme Protokolü
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}