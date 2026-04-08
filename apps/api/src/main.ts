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

  // Güvenlik
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:3041", "http://localhost:3040", "http://localhost:3042", "https://res.cloudinary.com"],
        connectSrc: ["'self'", "http://localhost:3041", "http://localhost:3040", "http://localhost:3042"],
      },
    }
  }));
  app.use(compression());
  app.use(cookieParser());

  // CORS - Birden fazla origin'e izin ver
  const allowedOrigins = [
    configService.get('FRONTEND_URL') || 'http://localhost:3040',
    configService.get('ADMIN_URL') || 'http://localhost:3042',
    'http://localhost:3040',
    'http://localhost:3042',
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // API rate limit vs...
  
  // Static Files - Görselleri serve et
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

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
