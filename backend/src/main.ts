import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  // Configure OpenAPI
  const oaConfig = new DocumentBuilder()
    .setTitle('SwipeFood API')
    .setDescription('Backend API for the SwipeFood App')
    .setVersion('1.0')
    .addCookieAuth('jwt')
    .build();
  const oaDoc = SwaggerModule.createDocument(app, oaConfig);
  SwaggerModule.setup('swagger', app, oaDoc);

  // Add global input validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Add cookie-parser
  app.use(cookieParser());

  await app.listen(3000);
}

bootstrap();
