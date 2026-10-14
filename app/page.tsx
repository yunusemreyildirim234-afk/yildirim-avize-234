import Link from "next/link";
import { prisma } from "@/lib/db";

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      variations: {
        orderBy: { id: "asc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function Home() {
  const products = await getProducts();

  const categories = [
    {
      title: "Kristal Serisi",
      desc: "Bohem el kesimi prizmatik kristaller",
      href: "/kategori/kristal",
      img: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Modern Avizeler",
      desc: "Minimalist mimari LED sarkıtlar",
      href: "/kategori/modern",
      img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Klasik Koleksiyon",
      desc: "Antika pirinç ve eskitme gövdeler",
      href: "/kategori/klasik",
      img: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Sarkıt & Aplikler",
      desc: "Ada tezgâhı ve köşe aydınlatmaları",
      href: "/kategori/sarkit",
      img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-amber-500 selection:text-white">
      {/* 1. HERO ALANI */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-24 sm:py-32 border-b border-neutral-800">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1920&q=80"
            alt="Lüks Avize"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block text-xs uppercase tracking-widest text-amber-400 font-semibold bg-amber-950/80 border border-amber-700/50 px-4 py-1.5 rounded-full shadow-lg">
            Beyoğlu Tevfikiye Han Atölyemizden
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-neutral-100 leading-tight">
            Işıltının ve Kristalin <br />
            <span className="text-amber-400 font-light italic">Yüzyıllık İmzası</span>
          </h1>

          <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Salonunuzun atmosferini baştan tanımlayan el işçiliği bohem kristal avizeler, modern LED tasarımlar ve saray zarafeti.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#vitrin"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20"
            >
              Koleksiyonu Keşfet ↓
            </a>
            <Link
              href="/iletisim"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm px-8 py-3.5 rounded-xl transition-all backdrop-blur-sm"
            >
              Beyoğlu Mağazamıza Gelin
            </Link>
          </div>
        </div>

        {/* Avantaj Şeridi */}
        <div className="relative max-w-6xl mx-auto px-4 mt-16 pt-8 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs text-neutral-400 font-medium">
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-400 text-base">💎</span>
            <span>%100 Bohem Kristali</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-400 text-base">📍</span>
            <span>Tevfikiye Han Teslimi</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-400 text-base">📦</span>
            <span>Kırılmaz Sandık Kargo</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-400 text-base">🛠️</span>
            <span>Özel Proje & Montaj</span>
          </div>
        </div>
      </section>

      {/* 2. GÖRSEL KATEGORİ VİTRİNİ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block mb-1">
            Tarzınıza Göre Seçin
          </span>
          <h2 className="text-3xl font-serif font-bold text-neutral-900">
            Aydınlatma Koleksiyonları
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-neutral-200"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <h3 className="font-serif font-bold text-xl group-hover:text-amber-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-neutral-300 font-light line-clamp-1">
                  {cat.desc}
                </p>
                <span className="inline-block text-[11px] font-semibold text-amber-400 pt-2">
                  Modelleri İncele →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CANLI VERİTABANI AVİZE VİTRİNİ */}
      <section id="vitrin" className="bg-white border-y border-neutral-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-5 mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-600 font-bold block mb-1">
                Canlı Stoklar
              </span>
              <h2 className="text-3xl font-serif font-bold text-neutral-900">
                Öne Çıkan Avizelerimiz
              </h2>
            </div>
            <span className="text-xs font-medium text-neutral-500 mt-2 sm:mt-0">
              Katalogda {products.length} özel tasarım mevcut
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="h-64 bg-neutral-900 relative overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-amber-400/60 font-serif">
                      💡 Yıldırım Avize
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-neutral-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>

                  <span className="absolute top-4 right-4 bg-amber-500/90 text-neutral-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    Mağazada Gör
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                      Mevcut Seçenekler:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.variations.map((v) => (
                        <span
                          key={v.id}
                          className="bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1 rounded-md font-medium"
                        >
                          {v.variationValue}
                          {v.extraPrice > 0 && ` (+${v.extraPrice} ₺)`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-400 block">Başlangıç Fiyatı</span>
                      <span className="text-xl font-bold text-neutral-900">
                        {product.basePrice.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>

                    <Link
                      href={`/urun/${product.id}`}
                      className="bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <span>İncele</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEYOĞLU HİKAYEMİZ */}
      <section id="hikaye" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-neutral-950 text-white rounded-3xl overflow-hidden border border-neutral-800 grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-16 flex flex-col justify-center space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Tarihi Şişhane Mirası
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-100 leading-tight">
              Işıltıyı Ekrandan Değil, <br />
              <span className="text-amber-400 italic font-light">Yerinde Deneyimleyin</span>
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              Yıldırım Avize, İstanbul'un aydınlatma kalbi Beyoğlu Şişhane'de kuruldu. Usta ellerin pirinç dökümle ve el kesimi kristallerle şekillendirdiği her avize, mekanın odak noktasıdır.
            </p>
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <span>📍 Tevfikiye Han, İskender Cad, Nazlı Hanım Sk. No:6 D:11, Beyoğlu/İstanbul</span>
              </div>
              <p className="text-neutral-400">
                İnternet sitemizden verdiğiniz siparişleri <strong>Beyoğlu Mağazamızdan Teslim Al</strong> seçeneği ile kargo beklemeden görerek teslim alabilirsiniz.
              </p>
            </div>
            <Link
              href="/iletisim"
              className="w-fit inline-block bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs px-6 py-3 rounded-xl transition-colors"
            >
              Mağaza & İletişim Bilgileri →
            </Link>
          </div>

          <div className="relative min-h-[360px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1200&q=80"
              alt="Beyoğlu Atölyemiz"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. GÜVEN ROZETLERİ */}
      <section className="bg-neutral-100 border-t border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-2">
            <span className="text-3xl block">📦</span>
            <h4 className="font-serif font-bold text-neutral-900 text-sm">Ahşap Sandık Kargo</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Özel korumalı ahşap sandıklarla sigortalı teslimat.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-2">
            <span className="text-3xl block">💎</span>
            <h4 className="font-serif font-bold text-neutral-900 text-sm">Bohem Kristal</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Solmayan orijinal el kesimi prizmatik taşlar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-2">
            <span className="text-3xl block">📍</span>
            <h4 className="font-serif font-bold text-neutral-900 text-sm">Click & Collect</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Tevfikiye Han atölyemizden görerek teslim alma imkanı.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-2">
            <span className="text-3xl block">🛠️</span>
            <h4 className="font-serif font-bold text-neutral-900 text-sm">Mimari Destek</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Tavan yüksekliği ve mekana göre usta montaj danışmanlığı.
            </p>
          </div>
        </div>
      </section>

      {/* 6. GÜNCELLENMİŞ ZENGİN FOOTER */}
      <footer className="bg-neutral-950 text-white border-t border-neutral-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          <div className="space-y-4 md:col-span-2">
            <span className="text-2xl font-serif font-bold tracking-wider text-neutral-100">
              YILDIRIM <span className="text-amber-500 font-sans font-light">AVİZE</span>
            </span>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Beyoğlu Şişhane'nin asırlık aydınlatma kültürünü, el işçiliği kristal avizeler ve modern mimari tasarımlarla evinize taşıyoruz.
            </p>
            <div className="text-xs text-neutral-400 space-y-1">
              <p className="text-amber-400 font-medium">📍 Tevfikiye Han, İskender Cad, Nazlı Hanım Sk. No:6 D:11, 34420 Beyoğlu / İstanbul</p>
              <p>📞 <a href="tel:05458126990" className="hover:text-amber-400 font-mono">0545 812 69 90</a> • <a href="tel:05372114223" className="hover:text-amber-400 font-mono">0537 211 42 23</a></p>
              <p className="text-[11px] text-neutral-500 pt-1">🕒 Hafta İçi (Pzt - Cuma): 09:00 - 18:00 | Hafta Sonu: Kapalı</p>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Koleksiyonlar</h5>
            <ul className="text-xs text-neutral-400 space-y-2">
              <li><Link href="/kategori/kristal" className="hover:text-amber-400">Kristal Avizeler</Link></li>
              <li><Link href="/kategori/modern" className="hover:text-amber-400">Modern LED Sarkıtlar</Link></li>
              <li><Link href="/kategori/klasik" className="hover:text-amber-400">Klasik Koleksiyon</Link></li>
              <li><Link href="/kategori/sarkit" className="hover:text-amber-400">Sarkıt & Aplikler</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Resmi Kanallarımız</h5>
            <ul className="text-xs text-neutral-400 space-y-2.5">
              <li>
                <a
                  href="https://www.instagram.com/yildirimavize/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>📸</span>
                  <span>Instagram (@yildirimavize)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/y.ld.r.m.avize/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>📘</span>
                  <span>Facebook Sayfamız</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.hepsiburada.com/magaza/yildirim-avize"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>🛒</span>
                  <span>Hepsiburada Mağazamız</span>
                </a>
                
              </li>
              <li>
                <a
                  href="https://www.trendyol.com/magaza/yildirimavize-m-379320?sst=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>🛒</span>
                  <span>Trendyol Mağazamız</span>
                </a>
              </li>
              <li className="pt-2 border-t border-neutral-800">
                <Link href="/iletisim" className="hover:text-amber-400 transition-colors block">
                  Mağaza Yol Tarifi & İletişim
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© 2026 Yıldırım Avize. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/yildirimavize/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300">Instagram</a>
            <span>•</span>
            <a href="https://www.facebook.com/y.ld.r.m.avize/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300">Facebook</a>
            <span>•</span>
            <a href="https://www.hepsiburada.com/magaza/yildirim-avize" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300">Hepsiburada</a>
            <span>•</span>
            <a href="https://www.trendyol.com/magaza/yildirimavize-m-379320" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300">Trendyol</a>
          </div>
        </div>
      </footer>
    </main>
  );
}