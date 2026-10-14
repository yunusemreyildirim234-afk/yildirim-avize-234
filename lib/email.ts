interface EmailOrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  shippingType: string;
  items: Array<{ title: string; variationName: string; quantity: number; price: number }>;
}

export async function sendOrderNotificationEmails(data: EmailOrderData) {
  const apiKey = process.env.RESEND_API_KEY;

  const isBeyoglu = data.shippingType === "BEYOGLU_MAGAZA_TESLIM";
  const shippingText = isBeyoglu
    ? "📍 Beyoğlu Şişhane Mağazamızdan Teslim Alınacak"
    : "📦 Sigortalı Ahşap Sandık Kargo ile Kapınıza Teslim Edilecek";

  // Müşteriye Gidecek Lüks HTML Fatura Şablonu
  const customerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 16px;">
      <h1 style="color: #171717; font-size: 26px; text-align: center; margin-bottom: 4px; letter-spacing: 1px;">YILDIRIM AVİZE</h1>
      <p style="text-align: center; color: #d97706; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 0; font-weight: bold;">Beyoğlu Şişhane Mirası</p>
      
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 25px 0;" />
      
      <div style="text-align: center; margin-bottom: 25px;">
        <span style="display: inline-block; background-color: #ecfdf5; color: #059669; font-size: 13px; font-weight: bold; padding: 6px 16px; rounded-full; border-radius: 20px; border: 1px solid #a7f3d0;">
          ✓ Siparişiniz Başarıyla Alındı
        </span>
      </div>

      <h2 style="color: #171717; font-size: 18px; margin-top: 0;">Sayın ${data.customerName},</h2>
      <p style="color: #525252; font-size: 14px; line-height: 1.6;">
        Yıldırım Avize'yi tercih ettiğiniz için teşekkür ederiz. Seçtiğiniz avizeler atölyemizde ustalarımız tarafından son kalite kontrolleri ve ışık testleri yapılmak üzere sıraya alınmıştır.
      </p>

      <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e5e5e5; margin: 25px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #737373;">Sipariş Kodu:</td>
            <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: bold; color: #171717;">${data.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #737373;">Teslimat Türü:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #171717;">${shippingText}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0 6px 0; border-top: 1px solid #f5f5f5; font-size: 15px; font-weight: bold; color: #171717;">Ödenen Toplam Tutar:</td>
            <td style="padding: 12px 0 6px 0; border-top: 1px solid #f5f5f5; text-align: right; font-size: 18px; font-weight: bold; color: #d97706;">${data.totalAmount.toLocaleString("tr-TR")} ₺</td>
          </tr>
        </table>
      </div>

      <p style="color: #737373; font-size: 12px; line-height: 1.5; text-align: center;">
        Avizeniz hazırlandığında veya kargoya verildiğinde tarafınıza tekrar bilgilendirme yapılacaktır.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 25px 0;" />

      <p style="font-size: 11px; color: #a3a3a3; text-align: center; margin: 0;">
        Bereketzade Mah., Şişhane / Beyoğlu, İstanbul | Tel: 0212 251 XX XX
      </p>
    </div>
  `;

  // Resend API üzerinden doğrudan canlı e-posta gönderimi
  if (apiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Yıldırım Avize <onboarding@resend.dev>",
          to: [data.customerEmail],
          subject: `✓ Siparişiniz Alındı - #${data.orderId.slice(0, 8)}`,
          html: customerHtml,
        }),
      });

      const resData = await response.json();
      if (response.ok) {
        console.log("✓ [CANLI E-POSTA BAŞARILI]: E-posta Resend üzerinden müşteriye ulaştırıldı! ID:", resData.id);
      } else {
        console.error("Resend API uyarısı:", resData);
      }
    } catch (err) {
      console.error("Resend bağlantı hatası:", err);
    }
  }
}