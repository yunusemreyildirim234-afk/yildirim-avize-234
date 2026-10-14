"use client";

import { useState } from "react";
import Link from "next/link";

export default function IletisimPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Özel Avize Tasarımı");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await res.json();
      if (data.success) {
        setSent(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        alert("Hata: " + data.error);
      }
    } catch {
      alert("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "Beyoğlu mağazasından teslim alma (Click & Collect) nasıl işler?",
      a: "Sipariş verirken 'Beyoğlu Mağaza Teslimi' seçeneğini işaretlediğinizde kargo ücreti ödemezsiniz. Avizeniz Tevfikiye Han atölyemizde özenle hazırlanıp kontrolden geçirildiğinde size haber verilir; hafta içi dilediğiniz gün gelip görerek teslim alabilirsiniz.",
    },
    {
      q: "Kargoda kırılma riski var mı?",
      a: "Tüm kristal ve metal avizelerimiz, darbelere karşı özel ahşap sandıklar ve strafor korumalarla sigortalı olarak sevk edilir. Olası bir hasarda koşulsuz ücretsiz parça/ürün değişimi garantimiz mevcuttur.",
    },
    {
      q: "Mekanımıza özel ölçülerde avize üretiyor musunuz?",
      a: "Evet! Yüksek tavanlı villalar, otel lobileri, restoranlar veya özel mekanlar için mimari çizimlerinize göre pirinç döküm ve kristal avize üretimi yapmaktayız.",
    },
    {
      q: "Montaj hizmetiniz var mı?",
      a: "İstanbul içi profesyonel montaj desteği sağlıyoruz. Şehir dışı gönderimlerde ise usta montaj şeması ve telefonla görüntülü destek veriyoruz.",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      {/* Üst Hero Başlık */}
      <section className="bg-neutral-950 text-white py-16 px-4 text-center border-b border-neutral-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold bg-amber-950/80 border border-amber-800/50 px-3 py-1 rounded-full">
            İletişim & Showroom
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neutral-100">
            Beyoğlu Atölye & Mağazamız
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto font-light">
            Işıltıyı yerinde incelemek, siparişinizi teslim almak veya özel mimari aydınlatma projeleriniz için bize ulaşın.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sol Kolon: Resmi Mağaza Bilgileri */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-4">
                Mağaza & Atölye
              </h2>

              <div className="space-y-4 text-xs">
                {/* Adres */}
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">📍</span>
                  <div>
                    <strong className="text-neutral-900 block font-semibold">Açık Adres:</strong>
                    <p className="text-neutral-600 mt-1 leading-relaxed">
                      Tevfikiye Han, İskender Cad, Nazlı Hanım Sk. No:6 D:11, 34420 Beyoğlu / İstanbul
                    </p>
                  </div>
                </div>

                {/* Telefonlar */}
                <div className="flex items-start gap-3 pt-3 border-t border-neutral-100">
                  <span className="text-xl shrink-0">📞</span>
                  <div>
                    <strong className="text-neutral-900 block font-semibold">Telefon & WhatsApp:</strong>
                    <a href="tel:05458126990" className="text-amber-700 hover:underline block mt-1 font-mono font-medium">
                      0545 812 69 90
                    </a>
                    <a href="tel:05372114223" className="text-neutral-700 hover:underline block font-mono font-medium">
                      0537 211 42 23
                    </a>
                  </div>
                </div>

                {/* Çalışma Saatleri */}
                <div className="flex items-start gap-3 pt-3 border-t border-neutral-100">
                  <span className="text-xl shrink-0">🕒</span>
                  <div className="w-full">
                    <strong className="text-neutral-900 block font-semibold mb-1">Çalışma Saatleri:</strong>
                    <div className="space-y-1 text-neutral-600 text-[11px]">
                      <div className="flex justify-between">
                        <span>Pazartesi - Cuma:</span>
                        <span className="font-semibold text-neutral-900">09:00 – 18:00</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Cumartesi - Pazar:</span>
                        <span>Kapalı</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resmi Pazaryeri ve Sosyal Medya Bağlantıları */}
                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <strong className="text-neutral-900 block font-semibold text-[11px] uppercase tracking-wider">
                    Resmi Kanallarımız:
                  </strong>
                  <div className="flex flex-col gap-2 pt-1">
                    <a
                      href="https://www.instagram.com/yildirimavize/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 transition-colors font-medium"
                    >
                      <span>📸</span>
                      <span>Instagram: @yildirimavize</span>
                    </a>
                    <a
                      href="https://www.facebook.com/y.ld.r.m.avize/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 transition-colors font-medium"
                    >
                      <span>📘</span>
                      <span>Facebook: Yıldırım Avize</span>
                    </a>
                    <a
                      href="https://www.trendyol.com/magaza/yildirimavize-m-379320?sst=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 transition-colors font-medium"
                    >
                      <span>🛒</span>
                      <span>Trendyol Resmi Mağazamız</span>
                    </a>
                    <a
                      href="https://www.hepsiburada.com/magaza/yildirim-avize"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 transition-colors font-medium"
                    >
                      <span>🛒</span>
                      <span>Hepsiburada Resmi Mağazamız</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Click & Collect Bilgisi */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 text-xs text-amber-950 space-y-2">
              <div className="font-bold flex items-center gap-2 text-sm">
                <span>📍</span>
                <span>Click & Collect (Mağazadan Teslim)</span>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                İnternet sitemizden sipariş verirken Tevfikiye Han atölyemizden teslim alma seçeneğini işaretleyerek ürünlerinizi usta kontrolleri yapılmış halde bizzat teslim alabilirsiniz.
              </p>
            </div>
          </div>

          {/* Sağ Kolon: Mesaj ve Mimari Talep Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-600 font-bold">
                  Bize Yazın
                </span>
                <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                  Özel Proje, Keşif veya Soru İletin
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Mekanınıza uygun avize seçimi ve mimari danışmanlık için ustalarımız size yardımcı olmaktan mutluluk duyar.
                </p>
              </div>

              {sent ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <span className="text-4xl block">✓</span>
                  <h3 className="font-serif font-bold text-emerald-900 text-lg">
                    Mesajınız Başarıyla Alındı!
                  </h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Talebiniz Tevfikiye Han atölyemize ulaştı. Ekibimiz mesai saatleri içinde tarafınızla iletişime geçecektir.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-xs font-semibold text-neutral-700 underline pt-2 block mx-auto"
                  >
                    Yeni Bir Mesaj Gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">Adınız Soyadınız *</label>
                      <input
                        required
                        type="text"
                        placeholder="Örn: Yunus Emre Yıldırım"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">E-posta Adresiniz *</label>
                      <input
                        required
                        type="email"
                        placeholder="ornek@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">Telefon Numaranız</label>
                      <input
                        type="tel"
                        placeholder="05XX XXX XX XX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">Konu Başlığı</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600 bg-white"
                      >
                        <option value="Özel Avize Tasarımı">Özel Avize Tasarımı / Üretim</option>
                        <option value="Mimari Proje & Keşif">Mimari Proje (Villa / Otel / Restoran)</option>
                        <option value="Sipariş & Teslimat Takibi">Sipariş & Mağaza Teslimat Takibi</option>
                        <option value="Restorasyon & Kristal Temini">Avize Restorasyonu & Kristal Temini</option>
                        <option value="Diğer">Diğer Sorular</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Mesajınız veya Proje Detayları *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Mekanınızın tavan yüksekliği, istediğiniz avize stili veya sormak istediğiniz sorular..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-neutral-900 hover:bg-amber-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-colors shadow-sm disabled:opacity-50 text-xs"
                  >
                    {loading ? "Gönderiliyor..." : "Mesajı İlet →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* SSS Alanı */}
        <div className="mt-20 border-t border-neutral-200 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block mb-1">
              Merak Edilenler
            </span>
            <h2 className="text-3xl font-serif font-bold text-neutral-900">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-2 shadow-2xs">
                <h4 className="font-serif font-bold text-neutral-900 text-sm">
                  {faq.q}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}