import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { completeThreeDS } from "@/lib/iyzico";
import { sendOrderConfirmation } from "@/lib/email";

// ─── POST: iyzico 3D Secure callback ────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const paymentId = formData.get("paymentId") as string;
    const conversationId = formData.get("conversationId") as string;
    const mdStatus = formData.get("mdStatus") as string;

    // mdStatus = 1 → 3D doğrulama başarılı
    if (mdStatus !== "1") {
      // Başarısız → siparişi iptal et
      if (conversationId) {
        await db.order.updateMany({
          where: { conversationId },
          data: { status: "CANCELLED" },
        });
      }
      // Kullanıcıyı başarısız sayfasına yönlendir
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?reason=3ds_failed`
      );
    }

    // 3D Secure ödemeyi tamamla
    const result = await completeThreeDS(paymentId, conversationId);

    if (result.status === "success") {
      // Siparişi onayla
      const order = await db.order.updateMany({
        where: { conversationId },
        data: {
          status: "PAID",
          paymentId: result.paymentId,
        },
      });

      // Sipariş bilgisini getir (e-posta için)
      const updatedOrder = await db.order.findFirst({
        where: { conversationId },
        include: {
          user: true,
          address: true,
          items: { include: { product: { include: { images: { take: 1 } } }, variant: true } },
        },
      });

      // Onay e-postası gönder
      if (updatedOrder) {
        await sendOrderConfirmation(updatedOrder).catch(console.error);
      }

      // Başarılı sayfasına yönlendir
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarili?order=${updatedOrder?.orderNumber}`
      );
    }

    // Ödeme başarısız
    await db.order.updateMany({
      where: { conversationId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?reason=payment_failed`
    );
  } catch (error) {
    console.error("Webhook hata:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz?reason=server_error`
    );
  }
}
