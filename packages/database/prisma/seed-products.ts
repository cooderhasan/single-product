import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addProducts() {
  const hidrolikCat = await prisma.category.findFirst({ where: { slug: 'hidrolik-sehpalar' } });
  const manuelCat = await prisma.category.findFirst({ where: { slug: 'manuel-sehpalar' } });
  
  if (!hidrolikCat || !manuelCat) {
    console.log('Kategoriler bulunamadı');
    return;
  }

  const products = [
    {
      slug: 'hidrolik-motosiklet-sehpasi-pro',
      name: 'Hidrolik Motosiklet Sehpası Pro',
      description: 'Profesyonel hidrolik pompalı motosiklet kaldırma sehpası. 600kg taşıma kapasitesi. Çift piston sistemi.',
      price: 8999,
      comparePrice: 10999,
      stock: 50,
      sku: 'HYD-PRO-001',
      isActive: true,
      isFeatured: true,
      categoryId: hidrolikCat.id,
    },
    {
      slug: 'hidrolik-sehpa-super-pro',
      name: 'Hidrolik Sehpa Super Pro',
      description: 'Tam donanımlı profesyonel model. 800kg kapasite, çift piston, otomatik kilit.',
      price: 12499,
      comparePrice: 14999,
      stock: 30,
      sku: 'HYD-SUPER-001',
      isActive: true,
      isFeatured: true,
      categoryId: hidrolikCat.id,
    },
    {
      slug: 'manuel-motosiklet-sehpasi-ekonomik',
      name: 'Manuel Motosiklet Sehpası Ekonomik',
      description: 'Ekonomik manuel kaldırma sehpası. 400kg taşıma kapasitesi. Ayarlanabilir yükseklik.',
      price: 5499,
      comparePrice: 6999,
      stock: 100,
      sku: 'MAN-EKO-001',
      isActive: true,
      isFeatured: true,
      categoryId: manuelCat.id,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  
  console.log('✅ Ürünler eklendi');
}

addProducts()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
