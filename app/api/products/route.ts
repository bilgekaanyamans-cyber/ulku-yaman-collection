import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";
import { z } from "zod";

// ─── GET: Ürünleri listele (filtreleme destekli) ────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const color = searchParams.get("color");
  const size = searchParams.get("size");
  const sort = searchParams.get("sort") || "newest";
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const where: any = { active: true };

  if (category) where.category = category;
  if (featured === "true") where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseInt(minPrice);
    if (maxPrice) where.price.lte = parseInt(maxPrice);
  }
  if (color || size) {
    where.variants = {
      some: {
        ...(color ? { colorName: { contains: color, mode: "insensitive" } } : {}),
        ...(size ? { size: parseInt(size) } : {}),
        stock: { gt: 0 },
      },
    };
  }

  const orderBy: any =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    sort === "popular" ? { sales: "desc" } :
    { createdAt: "desc" };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
        _count: { select: { reviews: true } },
      },
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// ─── POST: Yeni ürün ekle (Admin only) ─────────────────────

const createProductSchema = z.object({
  name: z.string().min(1, "Ürün adı zorunlu"),
  description: z.string().min(1, "Açıklama zorunlu"),
  price: z.number().positive("Fiyat pozitif olmalı"),
  comparePrice: z.number().positive().optional(),
  category: z.string().default("sandalet"),
  badge: z.string().optional(),
  featured: z.boolean().default(false),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
  })).min(1, "En az 1 görsel zorunlu"),
  variants: z.array(z.object({
    color: z.string(),
    colorName: z.string(),
    size: z.number(),
    stock: z.number().min(0),
    sku: z.string(),
  })).min(1, "En az 1 varyant zorunlu"),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = createProductSchema.parse(body);

    const slug = slugify(data.name, { lower: true, locale: "tr" });

    // Slug benzersiz mi kontrol et
    const existing = await db.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    // Toplam stok hesapla
    const totalStock = data.variants.reduce((sum, v) => sum + v.stock, 0);

    const product = await db.product.create({
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        category: data.category,
        badge: data.badge,
        featured: data.featured,
        stock: totalStock,
        images: {
          create: data.images.map((img, i) => ({
            url: img.url,
            altText: img.altText,
            order: i,
          })),
        },
        variants: {
          create: data.variants.map((v) => ({
            color: v.color,
            colorName: v.colorName,
            size: v.size,
            stock: v.stock,
            sku: v.sku,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error("Ürün oluşturma hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
