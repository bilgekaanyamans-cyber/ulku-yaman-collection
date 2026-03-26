import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  const { productId, rating, comment } = await req.json();
  if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: "Geçersiz puan" }, { status: 400 });

  const userId = (session.user as any).id;

  // Bu ürünü satın almış mı kontrol
  const hasPurchased = await db.orderItem.findFirst({
    where: { productId, order: { userId, status: { in: ["PAID","PREPARING","SHIPPED","DELIVERED"] } } },
  });
  if (!hasPurchased) return NextResponse.json({ error: "Bu ürünü satın almadan yorum yapamazsınız" }, { status: 403 });

  const review = await db.review.upsert({
    where: { userId_productId: { userId, productId } },
    update: { rating, comment, approved: false },
    create: { userId, productId, rating, comment },
  });

  return NextResponse.json(review, { status: 201 });
}
