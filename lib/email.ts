import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "siparis@ulkuyaman.com";
const SITE = process.env.NEXT_PUBLIC_SITE_NAME || "Ülkü Yaman Collection";

// ─── Sipariş Onay E-postası ──────────────────────────────────

export async function sendOrderConfirmation(order: any) {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #eee">
        <strong>${item.product.name}</strong><br>
        <span style="color:#8b7d6b;font-size:12px">Beden: ${item.variant.size} | Renk: ${item.variant.colorName} | Adet: ${item.quantity}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right">₺${(item.unitPrice * item.quantity).toLocaleString("tr-TR")}</td>
    </tr>
  `).join("");

  const html = `
    <div style="font-family:'Outfit',Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="text-align:center;padding:40px 0;border-bottom:1px solid #f5f0eb">
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:400;letter-spacing:3px;margin:0">ÜLKÜ YAMAN</h1>
        <p style="font-size:10px;letter-spacing:5px;color:#8b7d6b;margin:4px 0 0">COLLECTION</p>
      </div>

      <div style="padding:40px 30px">
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:400;margin:0 0 8px">Siparişiniz Onaylandı</h2>
        <p style="color:#8b7d6b;font-size:14px;margin:0 0 30px">Sipariş numaranız: <strong style="color:#1a1a1a">${order.orderNumber}</strong></p>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr style="border-bottom:2px solid #1a1a1a"><th style="text-align:left;padding:0 0 10px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8b7d6b">Ürün</th><th style="text-align:right;padding:0 0 10px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8b7d6b">Tutar</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <table style="width:100%;font-size:14px;margin-top:20px">
          <tr><td style="padding:4px 0;color:#8b7d6b">Ara Toplam</td><td style="text-align:right;padding:4px 0">₺${order.subtotal.toLocaleString("tr-TR")}</td></tr>
          <tr><td style="padding:4px 0;color:#8b7d6b">Kargo</td><td style="text-align:right;padding:4px 0">${order.shippingCost === 0 ? "Ücretsiz" : `₺${order.shippingCost}`}</td></tr>
          ${order.discount > 0 ? `<tr><td style="padding:4px 0;color:#2d6a4f">İndirim</td><td style="text-align:right;padding:4px 0;color:#2d6a4f">-₺${order.discount.toLocaleString("tr-TR")}</td></tr>` : ""}
          <tr style="border-top:2px solid #1a1a1a"><td style="padding:12px 0;font-weight:600;font-size:16px">Toplam</td><td style="text-align:right;padding:12px 0;font-weight:600;font-size:16px">₺${order.total.toLocaleString("tr-TR")}</td></tr>
        </table>

        <div style="margin-top:30px;padding:20px;background:#f5f0eb">
          <h3 style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8b7d6b;margin:0 0 10px">Teslimat Adresi</h3>
          <p style="font-size:14px;margin:0;line-height:1.6">
            ${order.address.firstName} ${order.address.lastName}<br>
            ${order.address.address}<br>
            ${order.address.district}, ${order.address.city} ${order.address.zipCode}<br>
            ${order.address.phone}
          </p>
        </div>

        <div style="text-align:center;margin-top:30px">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/hesabim/siparisler" style="display:inline-block;padding:14px 40px;background:#1a1a1a;color:#fff;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase">Siparişimi Takip Et</a>
        </div>
      </div>

      <div style="text-align:center;padding:30px;border-top:1px solid #f5f0eb;color:#8b7d6b;font-size:12px">
        <p style="margin:0">${SITE}</p>
        <p style="margin:4px 0 0">info@ulkuyaman.com | +90 212 555 00 00</p>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: `${SITE} <${FROM}>`,
    to: order.user.email,
    subject: `Sipariş Onayı — ${order.orderNumber}`,
    html,
  });
}

// ─── Kargo Bildirim E-postası ────────────────────────────────

export async function sendShippingNotification(order: any) {
  const html = `
    <div style="font-family:'Outfit',Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="text-align:center;padding:40px 0;border-bottom:1px solid #f5f0eb">
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:400;letter-spacing:3px;margin:0">ÜLKÜ YAMAN</h1>
      </div>
      <div style="padding:40px 30px;text-align:center">
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;margin:0 0 12px">Siparişiniz Kargoda!</h2>
        <p style="color:#8b7d6b;font-size:14px;margin:0 0 24px">${order.orderNumber} numaralı siparişiniz kargoya verildi.</p>
        <div style="background:#f5f0eb;padding:20px;margin:0 0 24px;text-align:left">
          <p style="font-size:12px;color:#8b7d6b;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">Kargo Bilgileri</p>
          <p style="font-size:14px;margin:0"><strong>Firma:</strong> ${order.shippingCompany || "—"}</p>
          <p style="font-size:14px;margin:4px 0 0"><strong>Takip No:</strong> ${order.trackingNumber || "—"}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/hesabim/siparisler" style="display:inline-block;padding:14px 40px;background:#1a1a1a;color:#fff;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase">Detayları Gör</a>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: `${SITE} <${FROM}>`,
    to: order.user.email,
    subject: `Kargo Bildirimi — ${order.orderNumber}`,
    html,
  });
}
