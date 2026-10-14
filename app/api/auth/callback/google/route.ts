import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/giris?error=google_iptal", req.url));
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || "158736155429-lc7aret2ncv05eie4tnj0kmdacr6rie4.apps.googleusercontent.com";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "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";
    const redirectUri = "http://127.0.0.1:4000/api/auth/callback/google";

    // 1. Google'dan Erişim Belgesi (Access Token) Alıyoruz
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Google Token Hatası:", tokenData);
      return NextResponse.redirect(new URL("/giris?error=token_alinamadi", req.url));
    }

    // 2. Google Sunucularından Kullanıcının Gerçek Adını ve E-postasını Çekiyoruz
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/giris?error=eposta_yok", req.url));
    }

    // 3. Veritabanımızda Bu Kullanıcıyı Bul veya Sıfırdan Güvenle Kaydet
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: googleUser.name || googleUser.email.split("@")[0],
          email: googleUser.email,
          password: "google_oauth_guvenli_hesap",
          role: "USER",
        },
      });
    }

    // 4. Giriş Başarılı -> Müşteriyi Profiline Gönder
    const targetUrl = new URL("/giris", req.url);
    targetUrl.searchParams.set("google_auth", "success");
    targetUrl.searchParams.set("email", user.email);

    return NextResponse.redirect(targetUrl);
  } catch (err) {
    console.error("Google Auth Hatası:", err);
    return NextResponse.redirect(new URL("/giris?error=sunucu_hatasi", req.url));
  }
}