-- 360 Sehpa Ürün İçerikleri
-- Bu script'i çalıştırarak demo içerikleri veritabanına ekleyebilirsiniz

-- 1. 6 Sebep (Reasons)
INSERT INTO "SiteContent" (id, key, title, subtitle, description, image, "buttonText", "buttonLink", data, "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'product_360sehpa_reasons',
  'Almanız İçin 6 Neden',
  'Avantajlar',
  NULL,
  NULL,
  NULL,
  NULL,
  '{
    "items": [
      {
        "icon": "🧰",
        "title": "Bakım İşlerini Tek Kişilik Şova Dönüştürür",
        "desc": "Tek başınıza tüm bakım işlemlerini rahatlıkla yapabilirsiniz."
      },
      {
        "icon": "🛞",
        "title": "Motoru Dimdik ve Güvenle Sabitler",
        "desc": "Kilitli mekanizma sayesinde motor her açıdan sabit kalır."
      },
      {
        "icon": "🔄",
        "title": "360° Döner Yapısı",
        "desc": "Her yöne dönebilen yapı sayesinde tüm parçalara kolay erişim."
      },
      {
        "icon": "🔐",
        "title": "Kilitli Mekanizma",
        "desc": "Güvenli kilit sistemi ile sabit ve stabil çalışma ortamı."
      },
      {
        "icon": "🏍️",
        "title": "Universal Uyum",
        "desc": "Neredeyse tüm motosiklet modelleriyle uyumlu tasarım."
      },
      {
        "icon": "💪",
        "title": "Yıllarca Eşlik Eder",
        "desc": "Kaliteli çelik gövde ile uzun ömürlü kullanım garantisi."
      }
    ]
  }'::jsonb,
  1,
  true,
  NOW(),
  NOW()
);

-- 2. Karşılaştırma Tablosu (Comparison)
INSERT INTO "SiteContent" (id, key, title, subtitle, description, image, "buttonText", "buttonLink", data, "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'product_360sehpa_comparison',
  'Neden 360° Döner Sehpa?',
  'Karşılaştırma',
  NULL,
  NULL,
  NULL,
  NULL,
  '{
    "rows": [
      {"feature": "Döner Mekanizma", "ours": "360° Dönebilir", "theirs": "Sabit Durur"},
      {"feature": "Kilit Sistemi", "ours": "Var (Güvenli)", "theirs": "Yok"},
      {"feature": "Uyum", "ours": "Universal", "theirs": "Sınırlı"},
      {"feature": "Malzeme", "ours": "Kalın Çelik", "theirs": "İnce Metal"},
      {"feature": "Kullanım Alanı", "ours": "Bakım & Park", "theirs": "Sadece Park"},
      {"feature": "Kullanım", "ours": "Tek Kişi", "theirs": "2 Kişi Gerekir"},
      {"feature": "Taşınabilirlik", "ours": "Kompakt", "theirs": "Hantal"},
      {"feature": "Montaj", "ours": "Hazır Kullanım", "theirs": "Montaj Gerekir"},
      {"feature": "Yüzey Koruma", "ours": "Toz Boyalı", "theirs": "Boyasız"},
      {"feature": "Dayanıklılık", "ours": "Uzun Ömürlü", "theirs": "Kısa Ömürlü"}
    ]
  }'::jsonb,
  2,
  true,
  NOW(),
  NOW()
);

-- 3. Müşteri Yorumları (Testimonials)
INSERT INTO "SiteContent" (id, key, title, subtitle, description, image, "buttonText", "buttonLink", data, "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'product_360sehpa_testimonials',
  'Kullanıcılar Ne Diyor',
  'Yorumlar',
  NULL,
  NULL,
  NULL,
  NULL,
  '{
    "reviews": [
      {
        "name": "Ekrem K.",
        "location": "İstanbul",
        "rating": 5,
        "title": "Servis rahatlığını garajıma getirdi.",
        "content": "Uzun zamandır zincir yağlama ve temizlik işini zor bela yapıyordum. Bu sehpayı alınca fark ettim, meğer her şey kolay olabiliyormuş! 360 derece döndürmek tam bir konfor."
      },
      {
        "name": "Emre D.",
        "location": "Konya",
        "rating": 5,
        "title": "Dar garajda bile mucize gibi.",
        "content": "Benim garaj neredeyse bir oda kadar küçük. Bu sehpayı görünce şüphe etmiştim ama hakikaten dönüyor! Motoru çevirmek inanılmaz kolaylaştı."
      },
      {
        "name": "Ayhan S.",
        "location": "Bursa",
        "rating": 5,
        "title": "Her kuruşunu hak ediyor.",
        "content": "Daha önce ucuz bir sehpa almıştım, ikinci kullanımda yamuldu. 360 Sehpa ise tank gibi sağlam. Kayma yok, sallanma yok, güven tam."
      }
    ],
    "stats": {
      "totalReviews": 127,
      "satisfaction": 98
    }
  }'::jsonb,
  3,
  true,
  NOW(),
  NOW()
);

-- 4. Sık Sorulan Sorular (FAQs)
INSERT INTO "SiteContent" (id, key, title, subtitle, description, image, "buttonText", "buttonLink", data, "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'product_360sehpa_faqs',
  'Sık Sorulan Sorular',
  'SSS',
  NULL,
  NULL,
  NULL,
  NULL,
  '{
    "faqs": [
      {
        "question": "Kargom Ne Zaman Ulaşır?",
        "answer": "Aynı Gün Kargoya Teslim Ediyoruz. Bulunduğunuz Bölgeye Göre 1-3 İş günü içinde size ulaşır."
      },
      {
        "question": "Ürünü Beğenmezsem İade Alıyor musunuz?",
        "answer": "Evet. Ürün Sağlam ve Hasarsız şekilde ve Tekrar Kullanılabilir durumdaysa 14 Gün İçinde geri iade edebilirsiniz."
      },
      {
        "question": "Toptan Satışınız var mı?",
        "answer": "Evet. Adetli alımlarınız için 5540144142 nolu hattan bilgi alabilirsiniz."
      },
      {
        "question": "Ürünüm Nereden Gelecek?",
        "answer": "Satın aldığınız ürünler Konya Merkezde bulunan depomuzdan sevk edilir."
      }
    ]
  }'::jsonb,
  4,
  true,
  NOW(),
  NOW()
);

-- 5. Ürün Açıklaması
INSERT INTO "SiteContent" (id, key, title, subtitle, description, image, "buttonText", "buttonLink", data, "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'product_360sehpa_description',
  'Ürün Açıklaması',
  NULL,
  '360 Derece Tam Döner Mekanizma: Motosikletini kaldırmanın ötesinde, her yöne 360 derece döndürebilirsin! Zincir yağlama, fren balata değişimi, motor bileşenlerine erişim veya lastik tamiri gibi işlerde motosikleti istediğin açıya getir. Standart sehpalarda sınırlı hareket varken, bu senin zamanını ve enerjini %50''ye varan oranda tasarruf ettirir. Bakım süren kısalır, keyfin artar!',
  NULL,
  NULL,
  NULL,
  '{
    "features": [
      "360° Döner Mekanizma",
      "Kilitli Tekerlekler",
      "Dayanıklı Çelik Gövde",
      "Universal Uyum"
    ]
  }'::jsonb,
  5,
  true,
  NOW(),
  NOW()
);

-- 6. Teknik Özellikler
INSERT INTO "SiteContent" (id, key, title, subtitle, description, image, "buttonText", "buttonLink", data, "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'product_360sehpa_specs',
  'Teknik Özellikler',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{
    "specs": [
      {"label": "Malzeme", "value": "Yüksek Dayanımlı Çelik"},
      {"label": "Taşıma Kapasitesi", "value": "500 kg"},
      {"label": "Dönüş Açısı", "value": "360 Derece"},
      {"label": "Tekerlek", "value": "4 Adet Kilitli Tekerlek"},
      {"label": "Takoz Ebatları", "value": "6 MM, 8 MM, 10 MM"}
    ]
  }'::jsonb,
  6,
  true,
  NOW(),
  NOW()
);
