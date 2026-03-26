import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { nanoid } from "nanoid";

// ─── GET: Kullanıcının siparişlerini getir ───────────────────

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

  const userId = (session.user as any).id;
  const isAdmin = (session.user as any).role === "ADMIN";

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const where: any = isAdmin ? {} : { userId };
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1, orderBy: { order: "asc" } } } },
            variant: true,
          },
        },
        address: true,
        user: { select: { name: true, email: true } },
      },
    }),
    db.order.count({ where }),
  ]);

  return NextResponse.json({
    orders,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// ─── POST: Yeni sipariş oluştur ─────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

  const userId = (session.user as any).id;
  const { addressId, paymentMethod, installments = 1, couponCode } = await req.json();

  // Sepeti getir
  const cartItems = await db.cartItem.findMany({
    where: { userId },
    include: { product: true, variant: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Sepetiniz boş" }, { status: 400 });
  }

  // Stok kontrolü
  for (const item of cartItems) {
    if (item.variant.stock < item.quantity) {
      return NextResponse.json({
        error: `${item.product.name} - ${item.variant.colorName} ${item.variant.size} stokta yetersiz`,
      }, { status: 400 });
    }
  }

  // Tutarları hesapla
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = subtotal >= 100000 ? 0 : 250;

  // Kupon kontrolü
  let discount = 0;
  if (couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: couponCode } });
    if (coupon && coupon.active && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      if (!coupon.minOrderTotal || subtotal >= coupon.minOrderTotal) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          discount = coupon.discountType === "PERCENTAGE"
            ? Math.round(subtotal * coupon.discountValue / 100)
            : coupon.discountValue;

          await db.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }
  }

  // Taksit farkı
  const installmentRates: Record<number, number> = { 1: 0, 3: 0, 6: 2.49, 9: 4.99, 12: 7.49 };
  const rate = installmentRates[installments] || 0;
  const installmentFee = Math.round(subtotal * rate / 100);

  const total = subtotal + shippingCost - discount + installmentFee;

  // Sipariş numarası üret
  const lastOrder = await db.order.findFirst({ orderBy: { createdAt: "desc" } });
  const lastNum = lastOrder?.orderNumber ? parseInt(lastOrder.orderNumber.replace("UY-", "")) : 10000;
  const orderNumber = `UY-${lastNum + 1}`;

  // Transaction ile sipariş oluştur + stok düş + sepet temizle
  const order = await db.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        paymentMethod: paymentMethod.toUpperCase(),
        subtotal,
        shippingCost,
        discount,
        installmentFee,
        total,
        installments,
        couponCode,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    // Stokları düş
    for (const item of cartItems) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          sales: { increment: item.quantity },
        },
      });
    }

    // Sepeti temizle
    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  return NextResponse.json(order, { status: 201 });
}

// ─── PATCH: Sipariş durumu güncelle (Admin) ──────────────────

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const { orderId, status, trackingNumber, shippingCompany } = await req.json();

  const updateData: any = { status };

  if (status === "SHIPPED" && trackingNumber) {
    updateData.trackingNumber = trackingNumber;
    updateData.shippingCompany = shippingCompany;
    updateData.shippedAt = new Date();
  }

  if (status === "DELIVERED") {
    updateData.deliveredAt = new Date();
  }

  const order = await db.order.update({
    where: { id: orderId },
    data: updateData,
  });

  // TODO: E-posta bildirimi gönder (kargo, teslim vs.)

  return NextResponse.json(order);
}
