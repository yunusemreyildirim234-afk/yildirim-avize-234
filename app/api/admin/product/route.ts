import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 1. Yeni Avize Ekleme (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, basePrice, imageUrl, variationType, variationValue, stock } = body;

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        category,
        basePrice: parseFloat(basePrice) || 0,
        imageUrl: imageUrl || null,
        variations: {
          create: [
            {
              variationType: variationType || "Seçenek",
              variationValue: variationValue || "Standart",
              extraPrice: 0,
              stock: parseInt(stock) || 10,
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// 2. Stok Adedini Güncelleme (PATCH)
export async function PATCH(req: Request) {
  try {
    const { variationId, stock } = await req.json();

    const updated = await prisma.productVariation.update({
      where: { id: variationId },
      data: { stock: Math.max(0, parseInt(stock) || 0) },
    });

    return NextResponse.json({ success: true, variation: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// 3. Avizeyi Güvenle Silme (DELETE)
export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();

    // Bağlı varyasyonları bul
    const variations = await prisma.productVariation.findMany({
      where: { productId },
      select: { id: true },
    });
    const variationIds = variations.map((v) => v.id);

    // Varsa bağlı sipariş kalemlerini ve varyasyonları temizle
    await prisma.orderItem.deleteMany({
      where: { variationId: { in: variationIds } },
    });
    await prisma.productVariation.deleteMany({
      where: { productId },
    });

    // Avizeyi veritabanından tamamen sil
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}