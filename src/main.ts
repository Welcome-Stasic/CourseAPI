import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import express, { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './Infrastructure/filters/global-exception.filter.js';

const server: Express = express();

async function bootstrap(): Promise<express.Express> {

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalFilters(new GlobalExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Learning Platform API')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('courses')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors();
  await app.init();
  return server;
}
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((server) => {
    server.listen(process.env.PORT ?? 3000);
  });
}
export default server;
