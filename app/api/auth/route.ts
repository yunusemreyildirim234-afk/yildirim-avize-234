import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { action, name, email, password } = await req.json();

    // 1. GERÇEK GOOGLE HESABI İLE GİRİŞ & KAYIT
    if (action === "google") {
      if (!email) {
        return NextResponse.json({ error: "Google hesabından e-posta bilgisi alınamadı." }, { status: 400 });
      }

      // Google'dan gelen gerçek e-postayı arıyoruz
      let user = await prisma.user.findUnique({
        where: { email },
        include: {
          orders: {
            include: { items: { include: { variation: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      // Eğer kullanıcı veritabanında yoksa, Google'dan gelen gerçek ismiyle otomatik oluşturulur
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: name || "Google Kullanıcısı",
            email: email,
            password: "google_oauth_secure",
            role: "USER",
          },
          include: {
            orders: {
              include: { items: { include: { variation: true } } },
              orderBy: { createdAt: "desc" },
            },
          },
        });
      }

      return NextResponse.json({ success: true, user });
    }

    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre zorunludur" }, { status: 400 });
    }

    // 2. STANDART KAYIT OLMA (REGISTER)
    if (action === "register") {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: {
          orders: {
            include: { items: { include: { variation: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (existingUser && existingUser.password === "guest_checkout") {
        const activatedUser = await prisma.user.update({
          where: { email },
          data: { name: name || existingUser.name, password: password },
          include: {
            orders: {
              include: { items: { include: { variation: true } } },
              orderBy: { createdAt: "desc" },
            },
          },
        });
        return NextResponse.json({ success: true, user: activatedUser });
      }

      if (existingUser) {
        return NextResponse.json({ error: "Bu e-posta adresiyle zaten bir hesap var. Lütfen giriş yapın." }, { status: 400 });
      }

      const newUser = await prisma.user.create({
        data: { name: name || "Müşteri", email, password, role: "USER" },
      });

      return NextResponse.json({
        success: true,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, orders: [] },
      });
    }

    // 3. STANDART GİRİŞ YAPMA (LOGIN)
    if (action === "login") {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          orders: {
            include: { items: { include: { variation: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (user && user.password === "guest_checkout") {
        const activatedUser = await prisma.user.update({
          where: { email },
          data: { password: password },
          include: {
            orders: {
              include: { items: { include: { variation: true } } },
              orderBy: { createdAt: "desc" },
            },
          },
        });
        return NextResponse.json({ success: true, user: activatedUser });
      }

      if (!user || user.password !== password) {
        return NextResponse.json({ error: "Geçersiz e-posta veya şifre." }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, orders: user.orders },
      });
    }

    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}