import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

  const { code, orderTotal } = await req.json();
  const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon) return NextResponse.json({ error: "Geçersiz kupon kodu" }, { status: 404 });
  if (!coupon.active) return NextResponse.json({ error: "Bu kupon artık geçerli değil" }, { status: 400 });
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return NextResponse.json({ error: "Kupon süresi dolmuş" }, { status: 400 });
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: "Kupon kullanım limiti dolmuş" }, { status: 400 });
  if (coupon.minOrderTotal && orderTotal < coupon.minOrderTotal) return NextResponse.json({ error: `Minimum sipariş tutarı: ₺${coupon.minOrderTotal.toLocaleString("tr-TR")}` }, { status: 400 });

  const discount = coupon.discountType === "PERCENTAGE"
    ? Math.round(orderTotal * coupon.discountValue / 100)
    : coupon.discountValue;

  return NextResponse.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    calculatedDiscount: discount,
  });
}
