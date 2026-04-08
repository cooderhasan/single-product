import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying product in database...\n');

  // Get product by slug
  const product = await prisma.product.findUnique({
    where: { slug: 'universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli' },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      variants: {
        include: {
          options: {
            include: {
              attribute: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    console.log('❌ Product not found!');
    return;
  }

  console.log('✅ Product Found!');
  console.log('═══════════════════════════════════════');
  console.log('ID:', product.id);
  console.log('Name:', product.name);
  console.log('Slug:', product.slug);
  console.log('SKU:', product.sku);
  console.log('Price:', product.price, 'TL');
  console.log('Compare Price:', product.comparePrice, 'TL');
  console.log('Stock:', product.stock);
  console.log('Is Active:', product.isActive);
  console.log('Is Featured:', product.isFeatured);
  console.log('Category:', product.category.name);
  console.log('═══════════════════════════════════════');
  console.log('\n📸 Images (' + product.images.length + '):');
  for (const img of product.images) {
    console.log(`  - ${img.url} ${img.isMain ? '(MAIN)' : ''}`);
  }
  console.log('\n📦 Variants (' + product.variants.length + '):');
  for (const variant of product.variants) {
    console.log(`  - ${variant.name} (SKU: ${variant.sku}, Price: ${variant.price} TL, Stock: ${variant.stock})`);
  }

  console.log('\n✨ Verification complete!');
  console.log('🔗 Product URL: http://localhost:3040/urun/' + product.slug);
  console.log('🔗 Admin Edit URL: http://localhost:3042/products/edit/' + product.id);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });