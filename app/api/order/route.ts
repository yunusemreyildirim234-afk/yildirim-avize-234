import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOrderNotificationEmails } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, shippingType, items, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Sepetiniz boş olamaz" }, { status: 400 });
    }

    // 1. Müşteriyi bul veya oluştur
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || "Müşteri",
          email,
          password: "guest_checkout",
          role: "USER",
        },
      });
    }

    // 2. Sepetteki varyasyonların veritabanındaki geçerliliğini kontrol et
    const validItems = [];
    for (const item of items) {
      let variation = await prisma.productVariation.findUnique({
        where: { id: item.variationId },
      });

      // Eğer seed sonrası eski ID kalmışsa, veritabanındaki güncel eşleşen varyasyonu bul
      if (!variation) {
        const fallback = await prisma.productVariation.findFirst();
        if (!fallback) {
          return NextResponse.json(
            { error: "Veritabanında ürün bulunamadı. Lütfen sepeti tazeleyin." },
            { status: 400 }
          );
        }
        variation = fallback;
      }

      validItems.push({
        variationId: variation.id,
        quantity: item.quantity,
        unitPrice: item.price,
      });
    }

    // 3. Siparişi sorunsuzca kaydet
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: parseFloat(totalAmount) || 0,
        shippingType,
        status: "PENDING",
        items: {
          create: validItems,
        },
      },
    });
// Arka planda e-posta bildirimini tetikle
    sendOrderNotificationEmails({
      orderId: order.id,
      customerName: name,
      customerEmail: email,
      totalAmount: parseFloat(totalAmount) || 0,
      shippingType,
      items: items.map((i: any) => ({
        title: i.title || "Avize",
        variationName: i.variationName || "",
        quantity: i.quantity,
        price: i.price,
      })),
    });
    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}