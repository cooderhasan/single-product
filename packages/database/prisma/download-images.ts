import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const UPLOADS_DIR = path.resolve(__dirname, '../../../apps/api/uploads/products');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('📁 Created uploads directory:', UPLOADS_DIR);
}

function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : require('http');
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  console.log('🌐 Downloading images from 360sehpa.com...\n');

  const product = await prisma.product.findUnique({
    where: { slug: 'universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli' },
    include: { images: true },
  });

  if (!product) {
    console.log('❌ Product not found!');
    return;
  }

  const imageUrls = product.images.map(img => ({
    id: img.id,
    oldUrl: img.url.startsWith('//') ? `https:${img.url}` : img.url,
  }));

  const newUrls: { id: string; newUrl: string }[] = [];

  for (const imageData of imageUrls) {
    try {
      console.log(`⬇️  Downloading: ${imageData.oldUrl}`);
      
      const extension = '.jpg';
      const filename = `${uuidv4()}${extension}`;
      const filepath = path.join(UPLOADS_DIR, filename);
      
      await downloadImage(imageData.oldUrl, filepath);
      
      // Local URL for the image (served by API at port 3041)
      const localUrl = `/uploads/products/${filename}`;
      newUrls.push({ id: imageData.id, newUrl: localUrl });
      
      console.log(`   ✅ Saved: ${filename}`);
    } catch (error) {
      console.error(`   ❌ Failed to download: ${imageData.oldUrl}`, error);
    }
  }

  // Update database with new URLs
  console.log('\n📝 Updating database with local URLs...\n');
  
  for (const { id, newUrl } of newUrls) {
    await prisma.productImage.update({
      where: { id },
      data: { url: newUrl },
    });
    console.log(`   ✅ Updated: ${id} → ${newUrl}`);
  }

  console.log('\n✨ Image download and update complete!');
  console.log(`📁 Total images downloaded: ${newUrls.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });