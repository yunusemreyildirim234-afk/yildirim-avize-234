import Link from "next/link";
import { prisma } from "@/lib/db";
import AdminAddProduct from "@/components/AdminAddProduct";
import AdminProductList from "@/components/AdminProductList";
import OrderStatusSelector from "@/components/OrderStatusSelector";

async function getAdminData() {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            variation: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      include: {
        // Varyasyonların ekranda asla yer değiştirmemesi için sabit sıralama:
        variations: {
          orderBy: { id: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { orders, products };
}
  

export default async function AdminPage() {
  const { orders, products } = await getAdminData();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const beyogluOrdersCount = orders.filter((o) => o.shippingType === "BEYOGLU_MAGAZA_TESLIM").length;

  return (
    <main className="min-h-screen bg-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Üst Başlık */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold">
              Yıldırım Avize Yönetim Merkezi
            </span>
            <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-1">
              Operasyon & Envanter Paneli
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold bg-white border border-neutral-300 text-neutral-700 px-4 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors w-fit"
          >
            ← Mağaza Vitrinine Dön
          </Link>
        </div>

        {/* 1. Özet İstatistik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <span className="text-xs text-neutral-500 font-medium block">Toplam Ciro</span>
            <span className="text-2xl font-bold text-neutral-900 mt-1 block">
              {totalRevenue.toLocaleString("tr-TR")} ₺
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <span className="text-xs text-neutral-500 font-medium block">Toplam Sipariş</span>
            <span className="text-2xl font-bold text-neutral-900 mt-1 block">
              {orders.length} adet
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">
            <span className="text-xs text-amber-800 font-medium block">Beyoğlu Teslimatları</span>
            <span className="text-2xl font-bold text-amber-900 mt-1 block">
              {beyogluOrdersCount} adet
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <span className="text-xs text-neutral-500 font-medium block">Katalogdaki Model</span>
            <span className="text-2xl font-bold text-neutral-900 mt-1 block">
              {products.length} model
            </span>
          </div>
        </div>

        {/* 2. Hızlı Avize Ekleme Modülü */}
        <AdminAddProduct />

        {/* 3. Canlı Avize Kataloğu & Stok Yönetimi */}
        <AdminProductList products={products} />

        {/* 4. Canlı Siparişler Tablosu */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-neutral-900">
              Gelen Siparişler & Durum Yönetimi
            </h2>
            <span className="text-xs text-neutral-500">
              Son {orders.length} işlem listeleniyor
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 text-xs">
              Henüz verilmiş bir sipariş bulunmuyor.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="p-4">Sipariş ID & Tarih</th>
                    <th className="p-4">Müşteri</th>
                    <th className="p-4">Alınan Avize</th>
                    <th className="p-4">Teslimat Türü</th>
                    <th className="p-4">Tutar</th>
                    <th className="p-4">Durum Değiştir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4 font-mono text-[11px] text-neutral-500">
                        {order.id.slice(0, 8)}...
                        <span className="block text-[10px] text-neutral-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-neutral-900 block">{order.user.name}</span>
                        <span className="text-neutral-500 text-[11px]">{order.user.email}</span>
                      </td>
                      <td className="p-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="text-xs">
                            <span className="font-semibold text-neutral-800">
                              {item.quantity}x {item.variation.variationValue}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4">
                        {order.shippingType === "BEYOGLU_MAGAZA_TESLIM" ? (
                          <span className="inline-block bg-amber-100 text-amber-900 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            📍 Beyoğlu Mağaza
                          </span>
                        ) : (
                          <span className="inline-block bg-blue-100 text-blue-900 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            📦 Özel Kargo
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-neutral-900 text-sm">
                        {order.totalAmount.toLocaleString("tr-TR")} ₺
                      </td>
                      <td className="p-4">
                        <OrderStatusSelector
                          orderId={order.id}
                          initialStatus={order.status}
                          shippingType={order.shippingType}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}