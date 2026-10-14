"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  variation: { variationValue: string };
}

interface Order {
  id: string;
  totalAmount: number;
  shippingType: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  orders?: Order[];
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Google'dan Başarıyla Dönen Kullanıcıyı Karşılama
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const googleAuth = params.get("google_auth");
    const userEmail = params.get("email");

    if (googleAuth === "success" && userEmail) {
      setLoading(true);
      fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "google", email: userEmail }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);
            window.history.replaceState({}, "", "/giris");
          }
        })
        .catch(() => alert("Kullanıcı verisi yüklenirken hata oluştu."))
        .finally(() => setLoading(false));
    }
  }, []);

  // Resmi Google OAuth Penceresini Açan Fonksiyon
  const handleGoogleOAuth = () => {
    const clientId = "158736155429-lc7aret2ncv05eie4tnj0kmdacr6rie4.apps.googleusercontent.com";
    const redirectUri = "http://127.0.0.1:4000/api/auth/callback/google";
    const scope = encodeURIComponent("openid email profile");
    
    // Google'ın resmi hesap seçici penceresi (prompt=select_account her seferinde hesap seçtirir)
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isLogin ? "login" : "register",
          name,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        alert(data.error);
      }
    } catch {
      alert("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Giriş Yapmış Müşteri Paneli
  if (user) {
    return (
      <main className="min-h-screen bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-600 font-bold">
                Müşteri Hesabı
              </span>
              <h1 className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                Hoş Geldiniz, {user.name}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
            </div>

            <button
              onClick={() => setUser(null)}
              className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-xl transition-colors w-fit"
            >
              Çıkış Yap
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-serif font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Geçmiş Siparişleriniz
            </h2>

            {user.orders && user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-neutral-200 rounded-2xl p-5 space-y-3 bg-neutral-50/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/80 pb-3 text-xs">
                      <div>
                        <span className="text-neutral-400 font-mono">Sipariş ID: {order.id.slice(0, 8)}...</span>
                        <span className="block text-[11px] text-neutral-500 mt-0.5">
                          Tarih: {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900">
                          {order.totalAmount.toLocaleString("tr-TR")} ₺
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            order.status === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "READY_FOR_PICKUP"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status === "DELIVERED"
                            ? "Teslim Edildi"
                            : order.status === "READY_FOR_PICKUP"
                            ? "Mağazada Teslime Hazır"
                            : order.status === "SHIPPED"
                            ? "Kargoya Verildi"
                            : "Hazırlanıyor"}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-700 space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.variation.variationValue}
                          </span>
                          <span className="font-medium text-neutral-900">
                            {(item.quantity * item.unitPrice).toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
                      Teslimat:{" "}
                      <strong>
                        {order.shippingType === "BEYOGLU_MAGAZA_TESLIM"
                          ? "📍 Beyoğlu Mağazasından Teslim Alınacak"
                          : "📦 Sigortalı Ahşap Sandık Kargo"}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-neutral-400 text-xs">
                Henüz kayıtlı bir siparişiniz bulunmuyor.
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-bold">
            Yıldırım Avize
          </span>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">
            {isLogin ? "Müşteri Girişi" : "Yeni Hesap Oluştur"}
          </h1>
          <p className="text-xs text-neutral-500">
            {isLogin
              ? "Siparişlerinizi ve sepetinizi takip etmek için giriş yapın."
              : "Beyoğlu koleksiyonuna özel ayrıcalıklar için kayıt olun."}
          </p>
        </div>

        {/* RESMİ GOOGLE HIZLI GİRİŞ VE KAYIT BUTONU */}
        <button
          type="button"
          onClick={handleGoogleOAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-semibold py-3.5 px-4 rounded-2xl transition-all shadow-2xs hover:shadow-sm text-xs disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isLogin ? "Google ile Hızlı Giriş Yap" : "Google ile Hızlı Kayıt Ol"}</span>
        </button>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-neutral-400 uppercase tracking-wider relative font-medium">
            veya e-posta ile
          </span>
        </div>

        {/* Sekmeler */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              isLogin ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              !isLogin ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLogin && (
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Adınız Soyadınız</label>
              <input
                required
                type="text"
                placeholder="Örn: Müşteri Adı"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">E-posta Adresi</label>
            <input
              required
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Şifre</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? "İşleniyor..." : isLogin ? "Giriş Yap" : "Hesap Oluştur"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-neutral-500 hover:text-amber-600 transition-colors">
            ← Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </main>
  );
}