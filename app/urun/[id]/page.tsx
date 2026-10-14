import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductDetailClient from "@/components/ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  // Veritabanından ilgili ürünü ve bağlı varyasyonlarını çekiyoruz
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variations: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Üst Gezinme / Ekmek Kırıntısı (Breadcrumb) */}
        <nav className="text-xs text-neutral-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span>{product.category} Avizeler</span>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{product.title}</span>
        </nav>

        {/* İstemci Tarafı İnteraktif Detay Bileşeni */}
        <ProductDetailClient product={product} />
      </div>
    </main>
  );
}