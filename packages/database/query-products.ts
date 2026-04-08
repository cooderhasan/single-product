const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany();
  console.log('Products:', JSON.stringify(products, null, 2));
}
main().catch((e: any) => console.error(e)).finally(() => prisma.$disconnect());
