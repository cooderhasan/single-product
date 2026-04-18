import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin kullanıcısı oluştur
  const adminPassword = await hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@360sehpa.com' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@360sehpa.com',
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
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // Ayarlar oluştur
  const settings = [
    { key: 'site_name', value: '360 Sehpa', group: 'general' },
    { key: 'site_description', value: 'Profesyonel Motosiklet Kaldırma Sehpaları', group: 'general' },
    { key: 'contact_email', value: 'info@360sehpa.com', group: 'contact' },
    { key: 'contact_phone', value: '+90 555 123 4567', group: 'contact' },
    { key: 'whatsapp_number', value: '905551234567', group: 'contact' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Settings created');

  // Site İçerikleri (İletişim, Banka, vb.)
  const siteContents = [
    {
      key: 'contact_info',
      title: 'İletişim Bilgilerimiz',
      description: 'Bize aşağıdaki kanallardan ulaşabilirsiniz.',
      data: {
        address: 'İkitelli OSB, Mutfakçılar Sanayi Sitesi, M10 Blok No: 34, Başakşehir/İstanbul',
        phone: '+90 532 123 45 67',
        email: 'iletisim@360sehpa.com',
        whatsapp: '905321234567',
        working_hours: 'Pzt-Cmt: 09:00 - 19:00'
      }
    },
    {
      key: 'bank_accounts',
      title: 'Banka Hesap Bilgilerimiz',
      description: 'Ödemelerinizi aşağıdaki IBAN numaralarına yapabilirsiniz.',
      data: {
        accounts: [
          { bank: 'Garanti BBVA', owner: '360 Sehpa LTD. ŞTİ.', iban: 'TR00 0000 0000 0000 0000 0000 00' },
          { bank: 'Ziraat Bankası', owner: '360 Sehpa LTD. ŞTİ.', iban: 'TR11 1111 1111 1111 1111 1111 11' }
        ]
      }
    },
    {
      key: 'product_showcase',
      title: 'Motosiklet Bakımını Bir Sanat Haline Getir',
      description: '360 Derece Tam Döner Mekanizma ile her açıdan erişim ve kontrol sağlayın.',
      buttonText: 'Hemen Keşfet',
      buttonLink: '/urun/universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli'
    }
  ];

  for (const content of siteContents) {
    await prisma.siteContent.upsert({
      where: { key: content.key },
      update: {
        title: content.title,
        description: content.description,
        data: content.data as any,
      },
      create: {
        ...content,
        isActive: true,
      },
    });
  }
  console.log('✅ Site Contents created');

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
