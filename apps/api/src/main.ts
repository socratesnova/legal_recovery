import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Security
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: process.env.WEB_URL?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Interceptors
  app.useGlobalInterceptors(new AuditInterceptor());

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Legal Recovery OS API')
    .setDescription('API for legal debt recovery platform')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Users')
    .addTag('Institutions')
    .addTag('Portfolios')
    .addTag('Cases')
    .addTag('Documents')
    .addTag('DataPassports')
    .addTag('Contacts')
    .addTag('Scores')
    .addTag('Agreements')
    .addTag('Payments')
    .addTag('Disputes')
    .addTag('Communications')
    .addTag('Reports')
    .addTag('Audit')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
