# Ülkü Yaman Collection — E-Ticaret Sitesi

Lüks Türk sandalet markası için full-stack e-ticaret platformu.

## 🛠 Teknoloji

- **Framework**: Next.js 14 (App Router)
- **Veritabanı**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Google OAuth + Email/Password)
- **Ödeme**: iyzico (3D Secure)
- **Görseller**: Cloudinary
- **E-posta**: Resend + React Email
- **Hosting**: Vercel
- **Stil**: Tailwind CSS

## 🚀 Kurulum (Adım Adım)

### 1. Repoyu klonla
```bash
git clone https://github.com/YOUR_USERNAME/ulku-yaman-collection.git
cd ulku-yaman-collection
npm install
```

### 2. Veritabanı (Neon — ücretsiz)
1. [neon.tech](https://neon.tech) → ücretsiz hesap aç
2. Yeni proje oluştur → "ulkuyaman"
3. Connection string'i kopyala

### 3. Google OAuth
1. [console.cloud.google.com](https://console.cloud.google.com) → Yeni proje
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Client ID ve Secret'ı kaydet

### 4. Ortam değişkenleri
```bash
cp .env.example .env.local
# .env.local dosyasını düzenle, tüm değerleri doldur
```

### 5. Veritabanını oluştur
```bash
npx prisma db push      # Tabloları oluştur
npx prisma generate      # Client'ı oluştur
npm run db:seed          # Örnek verileri yükle
```

### 6. Çalıştır
```bash
npm run dev
# → http://localhost:3000
```

### 7. Admin girişi
- E-posta: `admin@ulkuyaman.com`
- Şifre: `UlkuYaman2026!`

## 📁 Proje Yapısı

```
ulku-yaman/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth + kayıt
│   │   ├── products/      # Ürün CRUD
│   │   ├── cart/           # Sepet işlemleri
│   │   ├── orders/         # Sipariş yönetimi
│   │   └── webhooks/       # iyzico webhook
│   ├── (store)/            # Mağaza sayfaları
│   └── (admin)/            # Admin paneli
├── components/
│   ├── store/              # Mağaza componentleri
│   ├── admin/              # Admin componentleri
│   └── ui/                 # Ortak UI componentleri
├── lib/
│   ├── db.ts               # Prisma client
│   └── auth.ts             # NextAuth config
├── prisma/
│   ├── schema.prisma       # Veritabanı şeması
│   └── seed.ts             # Örnek veriler
├── types/
│   └── next-auth.d.ts      # Type tanımları
└── styles/                 # Global stiller
```

## 📊 Veritabanı Tabloları

| Tablo | Açıklama |
|-------|----------|
| users | Müşteriler + adminler |
| products | Ürün bilgileri |
| product_images | Ürün görselleri |
| product_variants | Renk/beden kombinasyonları + stok |
| cart_items | Kullanıcı sepetleri |
| orders | Siparişler |
| order_items | Sipariş kalemleri |
| reviews | Ürün yorumları |
| wishlist_items | Favori listesi |
| coupons | İndirim kuponları |
| addresses | Teslimat adresleri |

## 🔑 API Endpoint'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/products | Ürünleri listele (filtreleme destekli) |
| POST | /api/products | Yeni ürün ekle (Admin) |
| GET | /api/cart | Sepeti getir |
| POST | /api/cart | Sepete ekle |
| PATCH | /api/cart | Miktar güncelle |
| DELETE | /api/cart | Sepetten çıkar |
| GET | /api/orders | Siparişleri listele |
| POST | /api/orders | Sipariş oluştur |
| PATCH | /api/orders | Durum güncelle (Admin) |
| POST | /api/auth/register | Kayıt ol |

## 🎯 Sonraki Adımlar

- [ ] Mağaza frontend sayfaları
- [ ] Admin panel sayfaları
- [ ] iyzico ödeme entegrasyonu
- [ ] E-posta şablonları
- [ ] Kargo API entegrasyonu
- [ ] SEO optimizasyonu
