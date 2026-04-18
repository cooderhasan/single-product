import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const isProduction = configService.get('NODE_ENV') === 'production';
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3040';
  const adminUrl = configService.get('ADMIN_URL') || 'http://localhost:3042';

  // CORS: En erken aşamada OPTIONS preflight'ları yakala (Helmet'ten önce)
  app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin || '';
    const isOurDomain = origin.includes('360sehpa.com') || origin.includes('localhost') || !origin;

    if (isOurDomain) {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400');
    }

    // OPTIONS isteklerini burada bitir
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    next();
  });

  // enableCors da açık bırakıyoruz (çift güvence)
  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Güvenlik (CORS'tan sonra uygulanması daha sağlıklıdır)
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com", frontendUrl, adminUrl],
        connectSrc: ["'self'", frontendUrl, adminUrl, "https://api.360sehpa.com", "https://api.paytr.com"],
      },
    }
  }));
  app.use(compression());
  app.use(cookieParser());


  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // API rate limit vs...
  
  // Static Files - Görselleri serve et
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // API Prefix
  app.setGlobalPrefix('api/v1');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('360 Sehpa E-Commerce API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 3001;
  await app.listen(port);
  
  console.log(`🚀 API running on port ${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
