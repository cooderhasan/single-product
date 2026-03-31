# 360 Sehpa E-Ticaret Platformu

Yüksek performanslı, ölçeklenebilir ve satış odaklı özel e-ticaret platformu.

## 🚀 Teknoloji Stack

- **Backend:** Node.js + NestJS
- **Frontend:** Next.js 14 (App Router, SSR)
- **Admin Panel:** Next.js 14
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Cache:** Redis
- **Web Server:** Nginx
- **Deployment:** Docker + Coolify

## 📁 Proje Yapısı

```
ecommerce-monorepo/
├── apps/
│   ├── api/                 # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/       # JWT Authentication
│   │   │   ├── users/      # User Management
│   │   │   ├── products/   # Product CRUD
│   │   │   ├── categories/ # Category Management
│   │   │   ├── orders/     # Order Management
│   │   │   ├── payments/   # PayTR Integration
│   │   │   ├── cart/       # Shopping Cart
│   │   │   ├── coupons/    # Coupon System
│   │   │   ├── blog/       # Blog Management
│   │   │   └── banners/    # Banner Management
│   │   └── Dockerfile
│   ├── web/                # Next.js Frontend (Store)
│   │   ├── src/
│   │   │   ├── app/        # App Router
│   │   │   ├── components/
│   │   │   ├── store/      # Zustand Stores
│   │   │   └── lib/        # Utilities
│   │   └── Dockerfile
│   └── admin/              # Next.js Admin Panel
│       └── Dockerfile
├── packages/
│   └── database/           # Prisma Schema & Client
│       └── prisma/
│           └── schema.prisma
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── package.json
└── turbo.json
```

## 🛠️ Kurulum

### 1. Gereksinimler

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL
- Redis

### 2. Ortam Değişkenleri

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your_super_secret_key"

# API
NEXT_PUBLIC_API_URL="http://localhost:3041"
NEXT_PUBLIC_SITE_URL="http://localhost:3040"

# PayTR
PAYTR_MERCHANT_ID=""
PAYTR_MERCHANT_KEY=""
PAYTR_MERCHANT_SALT=""
PAYTR_TEST_MODE="1"

# Cloudinary (Resim Yükleme)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 3. Bağımlılıkları Yükle

```bash
# Root dizinde
npm install

# Database paketini hazırla
cd packages/database
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Geliştirme Modu

```bash
# Tüm servisleri başlat (Turborepo)
npm run dev

# Veya ayrı ayrı:
# API
cd apps/api && npm run start:dev

# Web
cd apps/web && npm run dev

# Admin
cd apps/admin && npm run dev
```

### 5. Docker ile Çalıştırma

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f

# Servisleri durdur
docker-compose down
```

## 📚 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Kayıt
- `POST /api/v1/auth/login` - Giriş
- `GET /api/v1/auth/me` - Kullanıcı bilgisi

### Products
- `GET /api/v1/products` - Ürün listesi
- `GET /api/v1/products/:slug` - Ürün detayı
- `GET /api/v1/products/featured` - Öne çıkan ürünler
- `POST /api/v1/products` - Ürün oluştur (Admin)
- `PUT /api/v1/products/:id` - Ürün güncelle (Admin)

### Categories
- `GET /api/v1/categories` - Kategori listesi
- `GET /api/v1/categories/:slug` - Kategori detayı

### Cart
- `GET /api/v1/cart` - Sepet
- `POST /api/v1/cart/items` - Sepete ekle
- `PUT /api/v1/cart/items/:id` - Güncelle
- `DELETE /api/v1/cart/items/:id` - Kaldır

### Orders
- `POST /api/v1/orders` - Sipariş oluştur
- `GET /api/v1/orders/my-orders` - Siparişlerim
- `GET /api/v1/orders/:id` - Sipariş detayı

### Payments (PayTR)
- `POST /api/v1/payments/paytr/initialize` - Ödeme başlat
- `POST /api/v1/payments/paytr/callback` - PayTR webhook

## 💳 PayTR Entegrasyonu

```typescript
// Ödeme başlatma
const response = await fetch('/api/v1/payments/paytr/initialize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderNumber: 'SP-12345' }),
});

const { iframeUrl } = await response.json();

// iframe gösterme
<iframe
  src={iframeUrl}
  style={{ width: '100%', height: '600px' }}
  frameBorder="0"
/>
```

## 🚀 Coolify Deployment

### 1. Sunucu Hazırlığı

```bash
# Coolify kurulumu
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### 2. Proje Ekleme

1. Coolify Dashboard > Projects > New Project
2. Git repository bağla
3. Environment: Production
4. Build Pack: Docker Compose

### 3. Environment Variables

Coolify'de aşağıdaki değişkenleri tanımla:

```env
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
PAYTR_MERCHANT_ID=
PAYTR_MERCHANT_KEY=
PAYTR_MERCHANT_SALT=
```

### 4. Deploy

```bash
# Otomatik deploy (git push ile)
git push origin main

# Manuel deploy
Coolify Dashboard > Deploy
```

## 🏗️ Admin Panel Özellikleri

- **Dashboard:** Ciro, sipariş istatistikleri, dönüşüm oranları
- **Ürün Yönetimi:** CRUD işlemleri, varyantlar, stok takibi
- **Sipariş Yönetimi:** Durum güncelleme, kargo takibi
- **Kategori Yönetimi:** Hiyerarşik kategoriler
- **Müşteri Yönetimi:** Kullanıcı listesi, sipariş geçmişi
- **Kupon Yönetimi:** İndirim kodları, limitler
- **Blog Yönetimi:** İçerik oluşturma, SEO
- **Banner Yönetimi:** Slider, kampanya görseli

## 🔒 Güvenlik

- JWT tabanlı authentication
- Role-based access control (RBAC)
- API rate limiting
- Input validation (class-validator)
- XSS & CSRF protection
- Helmet.js güvenlik başlıkları

## 📈 Performans

- Next.js Image optimization
- Redis caching (ürün listeleri)
- Lazy loading
- Gzip compression
- Static file caching (Nginx)

## 📄 Lisans

MIT License

## 🤝 Destek

Sorularınız için: info@360sehpa.com
