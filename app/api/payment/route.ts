import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initializeThreeDS, checkInstallments } from "@/lib/iyzico";

// ─── POST: 3D Secure ödeme başlat ───────────────────────────

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

  const body = await req.json();
  const { orderId, card, installment = 1 } = body;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      address: true,
      items: { include: { product: true, variant: true } },
    },
  });

  if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  if (order.userId !== (session.user as any).id) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/iyzico`;

    const result = await initializeThreeDS({
      orderId: order.id,
      orderNumber: order.orderNumber,
      price: order.subtotal,
      paidPrice: order.total,
      installment,
      card: {
        holderName: card.holderName,
        number: card.number,
        expireMonth: card.expireMonth,
        expireYear: card.expireYear,
        cvc: card.cvc,
      },
      buyer: {
        id: order.user.id,
        name: order.address.firstName,
        surname: order.address.lastName,
        email: order.user.email,
        phone: order.address.phone,
        address: order.address.address,
        city: order.address.city,
        district: order.address.district,
        zipCode: order.address.zipCode,
        ip: ip.split(",")[0].trim(),
      },
      items: order.items.map((item) => ({
        id: item.productId,
        name: item.product.name,
        price: (item.unitPrice * item.quantity).toFixed(2),
        category: "Sandaletler",
      })),
      callbackUrl,
    });

    if (result.status === "success") {
      // conversationId kaydet
      await db.order.update({
        where: { id: order.id },
        data: { conversationId: result.conversationId },
      });

      return NextResponse.json({
        status: "success",
        threeDSHtmlContent: result.threeDSHtmlContent,
      });
    }

    return NextResponse.json({ error: result.errorMessage || "Ödeme başlatılamadı" }, { status: 400 });
  } catch (error: any) {
    console.error("iyzico hata:", error);
    return NextResponse.json({ error: "Ödeme servisi hatası" }, { status: 500 });
  }
}

// ─── GET: BIN sorgulama (taksit oranlarını getir) ────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bin = searchParams.get("bin");
  const price = searchParams.get("price");

  if (!bin || !price) return NextResponse.json({ error: "bin ve price zorunlu" }, { status: 400 });

  try {
    const result = await checkInstallments(bin, parseFloat(price));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Taksit bilgisi alınamadı" }, { status: 500 });
  }
}
