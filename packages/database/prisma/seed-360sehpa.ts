import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding 360Sehpa product to database...');

  // "Motosiklet Sehpaları" kategorisini bul veya oluştur
  const category = await prisma.category.upsert({
    where: { slug: 'motosiklet-sehpalari' },
    update: {},
    create: {
      slug: 'motosiklet-sehpalari',
      name: 'Motosiklet Sehpaları',
      description: 'Profesyonel motosiklet kaldırma ve bakım sehpaları',
      sortOrder: 1,
      isActive: true,
    },
  });
  console.log('✅ Category found/created:', category.name, category.id);

  // Ana ürün - Universal Motosiklet Kaldırma Sehpası 360 Derece Döner - Kilitli
  const productSlug = 'universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli';
  
  const product = await prisma.product.upsert({
    where: { slug: productSlug },
    update: {},
    create: {
      slug: productSlug,
      sku: 'BRDMBZ779',
      name: 'Universal Motosiklet Kaldırma Sehpası 360 Derece Döner - Kilitli',
      shortDesc: 'Universal Motosiklet Kaldırma Sehpası 360 Derece Döner - Kilitli',
      description: `<p>Universal Motosiklet Kaldırma Sehpası 360 Derece Döner - Kilitli</p>
<p>Hafif ve kompakt tasarımı ile motosikletinizin bakımını kolayca yapabilirsiniz. 360 derece dönebilen sehpası ile motosikletinizin her açısına rahatça ulaşabilirsiniz. Kilitli yapısı sayesinde güvenli çalışmanızı sağlar.</p>
<h3>Özellikler:</h3>
<ul>
<li>360 derece dönebilme özelliği</li>
<li>Kilitli güvenli yapı</li>
<li>Universal tasarım - tüm motosikletlere uygun</li>
<li>Hafif ve kompakt</li>
<li>Dayanıklı çelik konstruktion</li>
<li>Kolay taşınabilir</li>
<li>Paslanmaz yüzey kaplama</li>
</ul>
<h3>Ürün Bilgileri:</h3>
<ul>
<li>Marka: 360Sehpa</li>
<li>Malzeme: Çelik</li>
<li>Kapasite: 250 kg</li>
<li>Yükseklik Ayarı: 30-79 cm</li>
</ul>`,
      price: 3722,
      comparePrice: 4500,
      stock: 100,
      stockStatus: 'IN_STOCK',
      trackStock: true,
      isActive: true,
      isFeatured: true,
      categoryId: category.id,
      metaTitle: 'Universal Motosiklet Kaldırma Sehpası 360 Derece Döner - Kilitli',
      metaDescription: 'Universal Motosiklet Kaldırma Sehpası 360 Derece Döner - Kilitli. Tüm motosikletlere uygun, 360 derece dönebilir, kilitli güvenli yapı.',
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });
  console.log('✅ Product found/created:', product.name, product.id);

  // Ürün görselleri - 360sehpa.com CDN URL'leri
  const images = [
    { url: '//360sehpa.com/cdn/shop/files/sehpa_son1.jpg?v=1764169893', alt: 'Universal Motosiklet Kaldırma Sehpası Ana Görsel', sortOrder: 0, isMain: true },
    { url: '//360sehpa.com/cdn/shop/files/sehpa_son2.jpg?v=1764169893', alt: '360 Derece Döner Sehpa Yan Görünüm', sortOrder: 1, isMain: false },
    { url: '//360sehpa.com/cdn/shop/files/sehpa_son3.jpg?v=1764169893', alt: 'Sehpa Detay Görünüm', sortOrder: 2, isMain: false },
    { url: '//360sehpa.com/cdn/shop/files/sehpa_son4.jpg?v=1764169893', alt: 'Sehpa Kilit Mekanizması', sortOrder: 3, isMain: false },
    { url: '//360sehpa.com/cdn/shop/files/sehpa_son5.jpg?v=1764169893', alt: 'Sehpa Kullanım Görünümü', sortOrder: 4, isMain: false },
    { url: '//360sehpa.com/cdn/shop/files/sehpa_son7.jpg?v=1764169893', alt: 'Sehpa Katlanmış Görünüm', sortOrder: 5, isMain: false },
    { url: '//360sehpa.com/cdn/shop/files/sehpa_motor1.jpg?v=1764169893', alt: 'Motosiklet Üzerinde Sehpa 1', sortOrder: 6, isMain: false },
    { url: '//360sehpa.com/cdn/shop/files/sehpa_motor2.jpg?v=1764169893', alt: 'Motosiklet Üzerinde Sehpa 2', sortOrder: 7, isMain: false },
    { url: '//360sehpa.com/cdn/shop/files/sehpa_motor3.jpg?v=1764169893', alt: 'Motosiklet Üzerinde Sehpa 3', sortOrder: 8, isMain: false },
  ];

  // Önce mevcut görselleri sil (upsert yerine)
  await prisma.productImage.deleteMany({
    where: { productId: product.id },
  });

  // Görselleri ekle
  for (const img of images) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
        isMain: img.isMain,
      },
    });
  }
  console.log('✅ Product images added: ' + images.length + ' images');

  // Varyantları oluştur: 10 MM, 8 MM, 6 MM
  const variantConfigs = [
    {
      sku: 'BRDMBZ779',
      name: '10 MM',
      price: 3722,
      stock: 50,
    },
    {
      sku: 'BRDMBZ780',
      name: '8 MM',
      price: 3722,
      stock: 50,
    },
    {
      sku: 'BRDMBZ781',
      name: '6 MM',
      price: 3722,
      stock: 50,
    },
  ];

  // Mevcut varyantları sil
  await prisma.productVariant.deleteMany({
    where: { productId: product.id },
  });

  // "Kaldırma Takoz Ebat Şeçin" attribute'unu bul veya oluştur
  const attribute = await prisma.productAttribute.create({
    data: {
      name: 'Kaldırma Takoz Ebat Şeçin',
      values: ['10 MM', '8 MM', '6 MM'],
      productId: product.id,
    },
  });

  for (const vc of variantConfigs) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: vc.sku,
        name: vc.name,
        price: vc.price,
        stock: vc.stock,
        isActive: true,
      },
    });

    // Her varyant için option oluştur
    await prisma.variantOption.create({
      data: {
        variantId: variant.id,
        attributeId: attribute.id,
        value: vc.name,
      },
    });
  }
  console.log('✅ Product variants added: ' + variantConfigs.length + ' variants');

  console.log('✨ 360Sehpa product seeding completed!');
  console.log('📦 Product ID:', product.id);
  console.log('🔗 Product URL: http://localhost:3040/urun/' + productSlug);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });