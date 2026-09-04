import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import express, { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './Infrastructure/filters/global-exception.filter.js';

const server: Express = express();

async function bootstrap(): Promise<void> {

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalFilters(new GlobalExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Learning Platform API')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('courses')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
  });
  app.enableCors();
  await app.init();
}

let bootstrapPromise: Promise<void> | undefined;

const initialize = (): Promise<void> => {
  bootstrapPromise ??= bootstrap();
  return bootstrapPromise;
};

if (process.env.NODE_ENV !== 'production') {
  initialize().then(() => {
    server.listen(process.env.PORT ?? 3000);
  });
}

export default async function handler(
  request: express.Request,
  response: express.Response,
): Promise<void> {
  await initialize();
  server(request, response);
}
