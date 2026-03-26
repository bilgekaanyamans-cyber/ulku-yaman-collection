import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ─── GET: Kullanıcının sepetini getir ────────────────────────

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

  const items = await db.cartItem.findMany({
    where: { userId: (session.user as any).id },
    include: {
      product: {
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
      },
      variant: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return NextResponse.json({ items, total, count: items.length });
}

// ─── POST: Sepete ürün ekle ──────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

  const { variantId, quantity = 1 } = await req.json();
  const userId = (session.user as any).id;

  // Varyant var mı ve stokta mı kontrol et
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  if (variant.stock < quantity) return NextResponse.json({ error: "Yetersiz stok" }, { status: 400 });

  // Zaten sepette mi?
  const existing = await db.cartItem.findUnique({
    where: { userId_variantId: { userId, variantId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > variant.stock) {
      return NextResponse.json({ error: "Stok yetersiz" }, { status: 400 });
    }

    const updated = await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
    return NextResponse.json(updated);
  }

  const item = await db.cartItem.create({
    data: {
      userId,
      productId: variant.productId,
      variantId,
      quantity,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

// ─── PATCH: Sepet miktarını güncelle ─────────────────────────

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

  const { cartItemId, quantity } = await req.json();

  if (quantity < 1) {
    await db.cartItem.delete({ where: { id: cartItemId } });
    return NextResponse.json({ deleted: true });
  }

  // Stok kontrolü
  const cartItem = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { variant: true },
  });

  if (!cartItem) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  if (quantity > cartItem.variant.stock) {
    return NextResponse.json({ error: "Stok yetersiz" }, { status: 400 });
  }

  const updated = await db.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return NextResponse.json(updated);
}

// ─── DELETE: Sepetten ürün çıkar ─────────────────────────────

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

  const { cartItemId } = await req.json();

  await db.cartItem.delete({ where: { id: cartItemId } });

  return NextResponse.json({ deleted: true });
}
