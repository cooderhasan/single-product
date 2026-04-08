import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function addProducts() {
  const result = await prisma.product.findMany({
    where: { slug: 'universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli' },
    select: { id: true, name: true, slug: true },
  });
  console.log('360 Sehpa Ürünü:', result);
  
  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
    take: 10,
  });
  console.log('Tüm Ürünler:', allProducts);
}

addProducts()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });