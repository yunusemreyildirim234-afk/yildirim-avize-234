import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

// URL slug'ını veritabanındaki kategori ismiyle eşleştiriyoruz
const categoryMap: Record<string, { title: string; dbCategory: string; desc: string }> = {
  modern: {
    title: "Modern Avizeler",
    dbCategory: "Modern",
    desc: "Minimalist çizgiler, ayarlanabilir LED aydınlatmalar ve çağdaş mekanlar için mimari formlar.",
  },
  klasik: {
    title: "Klasik Avizeler",
    dbCategory: "Klasik",
    desc: "Beyoğlu'nun tarihi dokusundan ilham alan antik eskitme gövdeler ve nostaljik detaylar.",
  },
  kristal: {
    title: "Kristal Serisi",
    dbCategory: "Kristal",
    desc: "Işıltıyı odağınıza alan el kesimi prizmatik taşlar ve pirinç döküm şıklığı.",
  },
  sarkit: {
    title: "Sarkıt & Aplik Modelleri",
    dbCategory: "Sarkıt",
    desc: "Yemek masası üstleri, antre ve dinlenme köşeleri için özel tasarlanmış tekli ve çoklu sarkıtlar.",
  },
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const currentCategory = categoryMap[slug];

  if (!currentCategory) {
    notFound();
  }

  // Veritabanından sadece bu kategoriye ait ürünleri çekiyoruz
  const products = await prisma.product.findMany({
    where: {
      category: currentCategory.dbCategory,
    },
    include: {
      variations: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-neutral-50 pb-20">
      {/* Kategori Başlık ve Tanıtım Alanı */}
      <section className="bg-neutral-900 text-white py-16 px-4 text-center border-b border-neutral-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <nav className="text-xs text-neutral-400 mb-2">
            <Link href="/" className="hover:text-amber-400">
              Ana Sayfa
            </Link>{" "}
            / <span className="text-neutral-200">{currentCategory.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-100">
            {currentCategory.title}
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto font-light">
            {currentCategory.desc}
          </p>
        </div>
      </section>

      {/* Ürün Listesi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-8 text-xs text-neutral-500">
          <span>Toplam {products.length} ürün listeleniyor</span>
          <span className="text-amber-700 font-medium">📍 Beyoğlu Mağazasında Sergilenen Modeller</span>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-md mx-auto space-y-3">
            <span className="text-3xl block">💡</span>
            <h3 className="font-serif font-bold text-neutral-900 text-base">
              Bu Kategoride Henüz Ürün Yok
            </h3>
            <p className="text-xs text-neutral-500">
              Yönetim panelinden ({`/admin`}) bu kategoriye yeni bir avize ekleyebilirsiniz.
            </p>
            <Link
              href="/"
              className="inline-block bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors mt-2"
            >
              Tüm Kataloğu Gör
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="h-48 bg-neutral-950 relative flex items-center justify-center p-6 text-center">
                  <div className="text-amber-400/80">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-14 h-14 mx-auto stroke-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v3m0 0a4 4 0 00-4 4v2m4-6a4 4 0 014 4v2M6 14h12m-10 0v2a2 2 0 002 2h4a2 2 0 002-2v-2m-8 0a2 2 0 01-2-2v-1m12 3a2 2 0 002-2v-1"
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-serif font-bold text-neutral-900">
                      {product.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-400 block">Başlangıç</span>
                      <span className="text-lg font-bold text-neutral-900">
                        {product.basePrice.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>

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
        )}
      </section>
    </main>
  );
}