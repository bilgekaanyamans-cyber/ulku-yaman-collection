import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  const items = await db.wishlistItem.findMany({
    where: { userId: (session.user as any).id },
    include: { product: { include: { images: { take: 1, orderBy: { order: "asc" } }, variants: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  const { productId } = await req.json();
  const userId = (session.user as any).id;

  const existing = await db.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });
  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ removed: true });
  }

  const item = await db.wishlistItem.create({ data: { userId, productId } });
  return NextResponse.json(item, { status: 201 });
}
