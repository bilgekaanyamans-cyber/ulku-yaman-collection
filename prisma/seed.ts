import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seed başlıyor...");

  // ─── Admin kullanıcı ────────────────────────
  const adminHash = await bcrypt.hash("UlkuYaman2026!", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@ulkuyaman.com" },
    update: {},
    create: {
      email: "admin@ulkuyaman.com",
      name: "Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin:", admin.email);

  // ─── Ürünler ────────────────────────────────
  const products = [
    {
      name: "Artemis Deri Sandaletler",
      slug: "artemis-deri-sandaletler",
      description: "El yapımı İtalyan deri ile üretilmiş, zarif tokası ile öne çıkan minimalist sandaletler. Yumuşak iç tabanlık ve dayanıklı dış taban ile gün boyu konfor sunar.",
      price: 8750,
      badge: "Yeni Sezon",
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", altText: "Artemis önden görünüm" },
        { url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80", altText: "Artemis detay" },
      ],
      variants: [
        { color: "#1a1a1a", colorName: "Siyah", sizes: [36,37,38,39,40,41], stock: 4 },
        { color: "#c4a882", colorName: "Bej", sizes: [36,37,38,39,40], stock: 3 },
        { color: "#8b6f4e", colorName: "Taba", sizes: [37,38,39,40], stock: 3 },
      ],
    },
    {
      name: "Calypso Metalik Sandaletler",
      slug: "calypso-metalik-sandaletler",
      description: "Metalik deri bantları ile göz kamaştıran, özel günler için tasarlanmış şık sandaletler. İnce taban yapısı ve zarif silueti ile ayağınıza lüks bir dokunuş katar.",
      price: 6500,
      badge: null,
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80", altText: "Calypso önden" },
        { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", altText: "Calypso detay" },
      ],
      variants: [
        { color: "#d4af37", colorName: "Altın", sizes: [36,37,38,39,40], stock: 4 },
        { color: "#c0c0c0", colorName: "Gümüş", sizes: [36,37,38,39], stock: 3 },
        { color: "#b76e79", colorName: "Rose Gold", sizes: [37,38,39,40], stock: 3 },
      ],
    },
    {
      name: "Boden Tokatlı Sandaletler",
      slug: "boden-tokatli-sandaletler",
      description: "Cesur metal tokaları ile dikkat çeken, modern tasarıma sahip lüks sandaletler. Premium dana derisinden üretilmiş, el işçiliği ile tamamlanmış özel koleksiyon parçası.",
      price: 12200,
      badge: "Sınırlı Üretim",
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1562273138-f9c383c2c12b?w=800&q=80", altText: "Boden önden" },
        { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", altText: "Boden detay" },
      ],
      variants: [
        { color: "#1a1a1a", colorName: "Siyah", sizes: [36,37,38,39,40,41,42], stock: 2 },
        { color: "#f5f0eb", colorName: "Krem", sizes: [37,38,39,40], stock: 2 },
      ],
    },
    {
      name: "Athena Gladyatör Sandaletler",
      slug: "athena-gladyator-sandaletler",
      description: "Antik Yunan'dan ilham alan, diz altına uzanan bağcıklı gladyatör sandaletler. Dikiş detayları ve el yapımı tokaları ile benzersiz bir parça.",
      price: 17500,
      badge: "En Çok Satan",
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", altText: "Athena önden" },
        { url: "https://images.unsplash.com/photo-1562273138-f9c383c2c12b?w=800&q=80", altText: "Athena detay" },
      ],
      variants: [
        { color: "#5c4033", colorName: "Kahverengi", sizes: [36,37,38,39,40], stock: 3 },
        { color: "#1a1a1a", colorName: "Siyah", sizes: [37,38,39], stock: 2 },
      ],
    },
    {
      name: "Riviera Süet Terlik",
      slug: "riviera-suet-terlik",
      description: "Ultra yumuşak süet deriden üretilmiş, yastıklı tabanlı terlik sandaletler. Günlük şıklığı rahatlıkla birleştiren, her kombinle uyumlu tasarım.",
      price: 5900,
      badge: null,
      featured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80", altText: "Riviera önden" },
        { url: "https://images.unsplash.com/photo-1562273138-f9c383c2c12b?w=800&q=80", altText: "Riviera detay" },
      ],
      variants: [
        { color: "#c4a882", colorName: "Bej", sizes: [36,37,38,39,40,41], stock: 5 },
        { color: "#8b6f4e", colorName: "Taba", sizes: [36,37,38,39,40], stock: 5 },
        { color: "#1a1a1a", colorName: "Siyah", sizes: [37,38,39,40,41], stock: 5 },
      ],
    },
    {
      name: "Olympia Örgü Sandaletler",
      slug: "olympia-orgu-sandaletler",
      description: "İnce deri şeritlerle elle örülmüş, zanaat ve modernliğin buluştuğu benzersiz sandaletler. Her çift, ustanın imzasını taşır.",
      price: 9800,
      badge: "El Yapımı",
      featured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1562273138-f9c383c2c12b?w=800&q=80", altText: "Olympia önden" },
        { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", altText: "Olympia detay" },
      ],
      variants: [
        { color: "#f5f0eb", colorName: "Krem", sizes: [36,37,38,39,40], stock: 3 },
        { color: "#c4a882", colorName: "Bej", sizes: [37,38,39,40], stock: 3 },
      ],
    },
  ];

  for (const p of products) {
    const totalStock = p.variants.reduce((sum, v) => sum + v.sizes.length * v.stock, 0);

    const created = await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        badge: p.badge,
        featured: p.featured,
        stock: totalStock,
        sales: Math.floor(Math.random() * 80) + 10,
        views: Math.floor(Math.random() * 2000) + 200,
        images: {
          create: p.images.map((img, i) => ({ url: img.url, altText: img.altText, order: i })),
        },
        variants: {
          create: p.variants.flatMap((v) =>
            v.sizes.map((size) => ({
              color: v.color,
              colorName: v.colorName,
              size,
              stock: v.stock,
              sku: `UY-${p.slug.split("-")[0].toUpperCase()}-${v.colorName.substring(0,3).toUpperCase()}-${size}`,
            }))
          ),
        },
      },
    });
    console.log(`✅ Ürün: ${created.name}`);
  }

  // ─── Örnek kupon ────────────────────────────
  await db.coupon.upsert({
    where: { code: "HOSGELDIN" },
    update: {},
    create: {
      code: "HOSGELDIN",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderTotal: 5000,
      maxUses: 100,
    },
  });
  console.log("✅ Kupon: HOSGELDIN (%10)");

  console.log("\n🎉 Seed tamamlandı!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
