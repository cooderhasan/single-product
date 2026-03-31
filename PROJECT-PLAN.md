# 360 Sehpa E-Ticaret Platformu - Yol Haritası

> **Proje:** 360sehpa.com Özel E-Ticaret Platformu  
> **Tarih:** Mart 2026  
> **Mevcut Durum:** Frontend çalışıyor, API hatalı, Admin boş

---

## 📊 MEVCUT DURUM ÖZETİ

### ✅ Tamamlananlar

#### 1. ALTYAPI & MİMARİ
- [x] Monorepo yapı (Turborepo)
- [x] Proje klasör yapısı (apps/web, apps/api, packages/database)
- [x] Docker Compose yapılandırması
- [x] Environment variables (.env)
- [x] Nginx konfigürasyonu

#### 2. VERİTABANI (Prisma)
- [x] PostgreSQL schema (642 satır)
- [x] Modeller: User, Product, Category, Order, Payment, Coupon, BlogPost, Banner, vb.
- [x] Prisma Client generate edildi
- [x] Database package build edildi

#### 3. BACKEND API (NestJS) - ⚠️ KISMEN
- [x] Proje yapısı ve modüller
- [x] Auth modülü (JWT, Guards, Decorators)
- [x] Products, Categories, Orders, Cart, Coupons, Blog, Banners modülleri
- [x] PayTR servis yapısı
- [ ] **❌ HATALAR:** API çalışmıyor (41 TypeScript hatası)
- [ ] **❌ EKSİK:** API kodunda typo'lar (useGlobalPipe vs useGlobalPipes)

#### 4. FRONTEND (Next.js) - ⚠️ KISMEN
- [x] Next.js 14 App Router yapısı
- [x] Tailwind CSS entegrasyonu
- [x] Ana sayfa (Hero, Ürünler, Kategoriler)
- [x] Ürün listeleme sayfası (/urunler)
- [x] Ürün detay sayfası (/urun/[slug])
- [x] Hakkımızda sayfası (/hakkimizda)
- [x] Blog listesi (/blog)
- [x] Blog detay sayfası (/blog/[slug])
- [x] İletişim sayfası (/iletisim)
- [x] Header & Footer komponentleri
- [x] Demo içerikler (360sehpa.com baz alınarak)
- [ ] **❌ EKSİK:** API bağlantısı çalışmıyor
- [ ] **❌ EKSİK:** Gerçek ürün verileri
- [ ] **❌ EKSİK:** Sepet fonksiyonelliği
- [ ] **❌ EKSİK:** Kullanıcı girişi

#### 5. ADMIN PANEL (Next.js) - ❌ BOŞ
- [ ] **❌ EKSİK:** Tüm admin sayfaları boş
- [ ] **❌ EKSİK:** Login sayfası
- [ ] **❌ EKSİK:** Dashboard
- [ ] **❌ EKSİK:** Ürün CRUD
- [ ] **❌ EKSİK:** Sipariş yönetimi

---

## 🎯 YOL HARİTASI (Öncelik Sırasına Göre)

### FAZ 1: API DÜZELTME (ACİL) ⏰ 1-2 Gün

#### 1.1 API Kod Hatalarını Düzelt
- [ ] `main.ts`: `useGlobalPipe` → `useGlobalPipes` düzelt
- [ ] `@ecommerce/database` import hatalarını çöz
- [ ] TypeScript tip hatalarını gider
- [ ] API başarıyla çalıştır

#### 1.2 API Test & Doğrulama
- [ ] Tüm endpoint'leri test et
- [ ] Swagger dokümantasyonunu kontrol et
- [ ] Postman collection oluştur

**Tahmini Süre:** 1-2 gün  
**Bağımlılık:** Database package çalışıyor ✅

---

### FAZ 2: FRONTEND API ENTEGRASYONU ⏰ 2-3 Gün

#### 2.1 API Client Kurulumu
- [ ] Axios instance yapılandırması
- [ ] API endpoint URL'leri env'den al
- [ ] Error handling middleware

#### 2.2 Sayfaları API'ye Bağla
- [ ] Ana sayfa: Gerçek ürünleri, kategorileri, banner'ları çek
- [ ] Ürün listesi: API'den ürünleri getir
- [ ] Ürün detay: API'den ürün bilgisi getir
- [ ] Blog: API'den blog yazılarını getir

#### 2.3 Sepet Sistemi
- [ ] Zustand store yapılandırması
- [ ] LocalStorage senkronizasyonu
- [ ] Sepet sayfası oluştur
- [ ] API ile sepet senkronizasyonu

**Tahmini Süre:** 2-3 gün  
**Bağımlılık:** FAZ 1 tamamlanmalı

---

### FAZ 3: KULLANICI YÖNETİMİ ⏰ 2-3 Gün

#### 3.1 Kimlik Doğrulama
- [ ] Login sayfası
- [ ] Register sayfası
- [ ] JWT token yönetimi (Zustand + Cookie)
- [ ] Protected routes
- [ ] Şifre sıfırlama

#### 3.2 Kullanıcı Profili
- [ ] Profil sayfası
- [ ] Adres yönetimi
- [ ] Sipariş geçmişi
- [ ] Favoriler

**Tahmini Süre:** 2-3 gün  
**Bağımlılık:** FAZ 2 tamamlanmalı

---

### FAZ 4: ÖDEME SİSTEMİ ⏰ 2-3 Gün

#### 4.1 PayTR Entegrasyonu
- [ ] PayTR iframe entegrasyonu
- [ ] Ödeme başlatma endpoint'i
- [ ] Webhook callback handler
- [ ] Ödeme durumu güncelleme

#### 4.2 Havale/EFT Seçeneği
- [ ] Manuel ödeme sayfası
- [ ] Banka hesap bilgileri gösterimi
- [ ] Ödeme bildirim formu

#### 4.3 Sipariş Akışı
- [ ] Ödeme sayfası
- [ ] Sipariş özeti
- [ ] Sipariş tamamlandı sayfası
- [ ] E-posta bildirimleri (şablon)

**Tahmini Süre:** 2-3 gün  
**Bağımlılık:** FAZ 3 tamamlanmalı

---

### FAZ 5: ADMIN PANEL ⏰ 3-4 Gün

#### 5.1 Admin Altyapı
- [ ] Admin login sayfası
- [ ] Admin layout (sidebar + header)
- [ ] Route protection (admin guard)

#### 5.2 Dashboard
- [ ] Ciro kartları (günlük, haftalık, aylık)
- [ ] Sipariş istatistikleri
- [ ] Dönüşüm oranları
- [ ] Grafikler (Chart.js)

#### 5.3 Ürün Yönetimi
- [ ] Ürün listesi (tablo)
- [ ] Ürün ekleme/düzenleme formu
- [ ] Resim yükleme (Cloudinary)
- [ ] Varyant yönetimi
- [ ] Stok yönetimi

#### 5.4 Kategori Yönetimi
- [ ] Kategori listesi
- [ ] Kategori ekleme/düzenleme
- [ ] Hiyerarşik yapı

#### 5.5 Sipariş Yönetimi
- [ ] Sipariş listesi (filtreleme, sıralama)
- [ ] Sipariş detay sayfası
- [ ] Durum güncelleme (bekliyor → ödendi → kargoda → tamamlandı)
- [ ] Kargo takip no ekleme

#### 5.6 Müşteri Yönetimi
- [ ] Müşteri listesi
- [ ] Müşteri detay
- [ ] Sipariş geçmişi görüntüleme

#### 5.7 Kupon Yönetimi
- [ ] Kupon listesi
- [ ] Kupon oluşturma
- [ ] İndirim kuralları

#### 5.8 Banner Yönetimi
- [ ] Banner listesi
- [ ] Banner ekleme/düzenleme
- [ ] Pozisyon yönetimi

#### 5.9 Blog Yönetimi
- [ ] Blog yazısı listesi
- [ ] Blog ekleme/düzenleme
- [ ] SEO alanları

**Tahmini Süre:** 3-4 gün  
**Bağımlılık:** FAZ 1 tamamlanmalı

---

### FAZ 6: EKSTRA ÖZELLİKLER ⏰ 2-3 Gün

#### 6.1 WhatsApp Entegrasyonu
- [ ] Floating WhatsApp butonu
- [ ] Özel mesaj şablonu (ürün bilgisi ile)

#### 6.2 Analytics
- [ ] Google Analytics 4 entegrasyonu
- [ ] Meta Pixel entegrasyonu
- [ ] Event tracking (sepet, satın alma, vb.)

#### 6.3 XML Feed
- [ ] Ürün XML feed endpoint'i
- [ ] Google Merchant Center formatı
- [ ] N11/Trendyol format seçenekleri

#### 6.4 SEO İyileştirmeleri
- [ ] Sitemap.xml oluşturma
- [ ] Robots.txt
- [ ] Schema.org yapılandırılmış veriler
- [ ] Meta tag yönetimi (sayfa bazlı)

#### 6.5 Performans Optimizasyonu
- [ ] Next.js Image optimizasyonu
- [ ] Lazy loading
- [ ] Redis cache entegrasyonu
- [ ] API rate limiting

**Tahmini Süre:** 2-3 gün  
**Bağımlılık:** FAZ 4 tamamlanmalı

---

### FAZ 7: TEST & DEPLOY ⏰ 2-3 Gün

#### 7.1 Test
- [ ] Unit testler (Jest)
- [ ] E2E testler (Playwright/Cypress)
- [ ] Lighthouse audit (90+ puan hedefi)
- [ ] Mobil test (responsive)

#### 7.2 Güvenlik
- [ ] XSS kontrolü
- [ ] CSRF kontrolü
- [ ] Input validation testleri
- [ ] Admin yetkilendirme testleri

#### 7.3 Deploy Hazırlık
- [ ] Production build testi
- [ ] Environment variables kontrolü
- [ ] SSL sertifikası hazırlığı
- [ ] Domain yapılandırması

#### 7.4 Coolify Deploy
- [ ] Coolify kurulumu
- [ ] Docker container build
- [ ] Database migration
- [ ] Domain bağlama
- [ ] SSL yapılandırması

**Tahmini Süre:** 2-3 gün  
**Bağımlılık:** Tüm fazlar tamamlanmalı

---

## 📋 ÖRNEK API ENDPOINTLERİ

```
# Auth
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
POST   /api/v1/auth/logout

# Products
GET    /api/v1/products
GET    /api/v1/products/:slug
GET    /api/v1/products/featured
POST   /api/v1/products (Admin)
PUT    /api/v1/products/:id (Admin)
DELETE /api/v1/products/:id (Admin)

# Categories
GET    /api/v1/categories
GET    /api/v1/categories/:slug

# Cart
GET    /api/v1/cart
POST   /api/v1/cart/items
PUT    /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id

# Orders
POST   /api/v1/orders
GET    /api/v1/orders/my-orders
GET    /api/v1/orders/:id
PUT    /api/v1/orders/:id/status (Admin)

# Payments
POST   /api/v1/payments/paytr/initialize
POST   /api/v1/payments/paytr/callback (Webhook)

# Coupons
POST   /api/v1/coupons/validate
GET    /api/v1/coupons (Admin)
POST   /api/v1/coupons (Admin)

# Blog
GET    /api/v1/blog/posts
GET    /api/v1/blog/posts/:slug
POST   /api/v1/blog/posts (Admin)

# Banners
GET    /api/v1/banners
GET    /api/v1/banners/position/:position
```

---

## 🔧 PAYTR ENTEGRASYONU ÖRNEK KOD

```typescript
// payments.service.ts
async initializePaytrPayment(order: Order) {
  const merchant_id = this.config.get('PAYTR_MERCHANT_ID');
  const merchant_key = this.config.get('PAYTR_MERCHANT_KEY');
  const merchant_salt = this.config.get('PAYTR_MERCHANT_SALT');
  
  const merchant_oid = `ORDER_${order.id}_${Date.now()}`;
  const email = order.user?.email || order.guestEmail;
  const payment_amount = order.total * 100; // Kuruş cinsinden
  
  // Sepet içeriği
  const user_basket = order.items.map(item => [
    item.productName,
    item.price.toString(),
    item.quantity
  ]);
  
  const hash_str = `${merchant_id}${email}${payment_amount}${merchant_oid}${user_basket}${merchant_salt}`;
  const paytr_token = crypto.createHmac('sha256', merchant_key).update(hash_str).digest('base64');
  
  const params = {
    merchant_id,
    user_ip: '127.0.0.1',
    merchant_oid,
    email,
    payment_amount,
    paytr_token,
    user_basket: Buffer.from(JSON.stringify(user_basket)).toString('base64'),
    debug_on: '1',
    no_installment: '0',
    max_installment: '12',
    currency: 'TL',
    test_mode: this.config.get('PAYTR_TEST_MODE', '1'),
    // ... diğer parametreler
  };
  
  const response = await axios.post('https://www.paytr.com/odeme/api/get-token', params);
  
  if (response.data.status === 'success') {
    return { iframeUrl: `https://www.paytr.com/odeme/guvenli/${response.data.token}` };
  }
  
  throw new Error(response.data.err_msg);
}
```

---

## 📁 PROJE KLASÖR YAPISI

```
ecommerce-monorepo/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── cart/
│   │   │   ├── coupons/
│   │   │   ├── blog/
│   │   │   ├── banners/
│   │   │   └── main.ts
│   │   └── Dockerfile
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   └── lib/
│   │   └── Dockerfile
│   └── admin/                  # Next.js Admin Panel
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── lib/
│       └── Dockerfile
├── packages/
│   └── database/               # Prisma Schema
│       ├── prisma/
│       │   └── schema.prisma
│       └── src/
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

## 📊 TOPLAM TAHMİNİ SÜRE

| Faz | Süre | Bağımlılık |
|-----|------|------------|
| FAZ 1: API Düzeltme | 1-2 gün | - |
| FAZ 2: Frontend API | 2-3 gün | FAZ 1 |
| FAZ 3: Kullanıcı | 2-3 gün | FAZ 2 |
| FAZ 4: Ödeme | 2-3 gün | FAZ 3 |
| FAZ 5: Admin Panel | 3-4 gün | FAZ 1 |
| FAZ 6: Ekstralar | 2-3 gün | FAZ 4 |
| FAZ 7: Test & Deploy | 2-3 gün | Hepsi |

**Toplam:** 14-21 gün (2-3 hafta)

---

## 🚀 SIRADAKİ ADIM

**ACİL ÖNCELİK:** FAZ 1 - API Düzeltme

API çalışmadığı için tüm sistem durmuş durumda. Öncelikle:
1. `main.ts` typo düzelt
2. TypeScript hatalarını gider
3. API'yi çalıştır

Bu tamamlandıktan sonra frontend API'ye bağlanabilir ve sistem çalışmaya başlar.

---

*Plan oluşturulma tarihi: Mart 2026*  
*Son güncelleme: İlk yol haritası*
