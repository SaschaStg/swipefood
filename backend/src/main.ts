import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  // Configure OpenAPI
  const oaConfig = new DocumentBuilder()
    .setTitle('SwipeFood API')
    .setDescription('Backend API for the SwipeFood App')
    .setVersion('1.0')
    .build();
  const oaDoc = SwaggerModule.createDocument(app, oaConfig);
  SwaggerModule.setup('swagger', app, oaDoc);

  await app.listen(3000);
}

bootstrap();
