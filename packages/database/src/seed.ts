import { prisma } from './client';
import { hash } from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');

  // Admin kullanıcısı oluştur
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Kategoriler oluştur
  const categories = [
    {
      slug: 'motosiklet-sehpalari',
      name: 'Motosiklet Sehpaları',
      description: 'Profesyonel motosiklet kaldırma ve bakım sehpaları',
      sortOrder: 1,
    },
    {
      slug: 'hidrolik-sehpalar',
      name: 'Hidrolik Sehpalar',
      description: 'Hidrolik sistemli motosiklet kaldırma sehpaları',
      sortOrder: 2,
    },
    {
      slug: 'manuel-sehpalar',
      name: 'Manuel Sehpalar',
      description: 'Manuel kaldırma mekanizmalı sehpalar',
      sortOrder: 3,
    },
    {
      slug: 'aksesuarlar',
      name: 'Aksesuarlar',
      description: 'Sehpa aksesuarları ve yedek parçalar',
      sortOrder: 4,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // Banner oluştur
  await prisma.banner.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Profesyonel Motosiklet Sehpaları',
        subtitle: 'Türkiye\'nin #1 Motosiklet Kaldırma Sehpası Üreticisi',
        image: '/images/banners/hero-1.jpg',
        link: '/kategori/motosiklet-sehpalari',
        buttonText: 'Ürünleri İncele',
        position: 'HOME_HERO',
        sortOrder: 1,
      },
      {
        title: 'Hidrolik Seri',
        subtitle: 'Tek parmakla kaldırın',
        image: '/images/banners/hero-2.jpg',
        link: '/kategori/hidrolik-sehpalar',
        buttonText: 'Keşfet',
        position: 'HOME_HERO',
        sortOrder: 2,
      },
    ],
  });
  console.log('✅ Banners created');

  // Ayarlar oluştur
  const settings = [
    { key: 'site_name', value: '360 Sehpa', group: 'general' },
    { key: 'site_description', value: 'Profesyonel Motosiklet Kaldırma Sehpaları', group: 'general' },
    { key: 'contact_email', value: 'info@360sehpa.com', group: 'contact' },
    { key: 'contact_phone', value: '+90 555 123 4567', group: 'contact' },
    { key: 'whatsapp_number', value: '905551234567', group: 'contact' },
    { key: 'shipping_free_threshold', value: '1000', group: 'shipping' },
    { key: 'shipping_default_cost', value: '75', group: 'shipping' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Settings created');

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
