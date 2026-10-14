import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await prisma.orderItem.deleteMany();
    await prisma.productVariation.deleteMany();
    await prisma.product.deleteMany();

    // 1. Sultanahmet Kristal Avize (Gerçek Kristal Fotoğrafı)
    await prisma.product.create({
      data: {
        title: "Sultanahmet 8'li Kristal Taşlı Avize",
        description: "El kesimi bohem kristalleri ve pirinç döküm gövdesiyle salonunuza saray zarafeti katın.",
        category: "Kristal",
        basePrice: 8500,
        imageUrl: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1000&q=80",
        variations: {
          create: [
            { variationType: "Gövde Kaplama", variationValue: "Parlak Gold", extraPrice: 0, stock: 12 },
            { variationType: "Gövde Kaplama", variationValue: "Krom Nikel", extraPrice: 500, stock: 8 },
          ],
        },
      },
    });

    // 2. Pera Modern LED Sarkıt (Gerçek Modern LED Fotoğrafı)
    await prisma.product.create({
      data: {
        title: "Pera Modern Halka LED Sarkıt Avize",
        description: "Minimalist mimari mekanlar için ayarlanabilir yükseklik ve dim edilebilir yüksek lümen LED aydınlatma.",
        category: "Modern",
        basePrice: 4200,
        imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
        variations: {
          create: [
            { variationType: "Işık Rengi", variationValue: "3000K Gün Işığı", extraPrice: 0, stock: 25 },
            { variationType: "Işık Rengi", variationValue: "4000K Doğal Beyaz", extraPrice: 0, stock: 15 },
          ],
        },
      },
    });

    // 3. Galata Eskitme Rustik Avize (Gerçek Rustik / Antik Fotoğrafı)
    await prisma.product.create({
      data: {
        title: "Galata Eskitme Rustik Metal Avize",
        description: "Beyoğlu'nun tarihi dokusundan esinlenen antika eskitme gövde ve amber rustik ampul uyumu.",
        category: "Klasik",
        basePrice: 3100,
        imageUrl: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=80",
        variations: {
          create: [
            { variationType: "Duy Sayısı", variationValue: "3'lü Başlık", extraPrice: 0, stock: 18 },
            { variationType: "Duy Sayısı", variationValue: "5'li Başlık", extraPrice: 900, stock: 10 },
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Avizeler gerçek fotoğraflarıyla veritabanına yüklendi!",
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}