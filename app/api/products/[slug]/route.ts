import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Params = { params: { slug: string } };

// ─── GET: Tek ürün getir ─────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const product = await db.product.findUnique({
    where: { slug: params.slug, active: true },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: [{ colorName: "asc" }, { size: "asc" }] },
      reviews: {
        where: { approved: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// ─── PATCH: Ürün güncelle (Admin) ────────────────────────────

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const body = await req.json();
  const product = await db.product.findUnique({ where: { slug: params.slug } });
  if (!product) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  const updated = await db.product.update({
    where: { id: product.id },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      comparePrice: body.comparePrice,
      badge: body.badge,
      active: body.active,
      featured: body.featured,
    },
    include: { images: true, variants: true },
  });

  return NextResponse.json(updated);
}

// ─── DELETE: Ürün sil (Admin) ────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const product = await db.product.findUnique({ where: { slug: params.slug } });
  if (!product) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  await db.product.delete({ where: { id: product.id } });
  return NextResponse.json({ deleted: true });
}
