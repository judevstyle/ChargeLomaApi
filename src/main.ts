import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import * as fs from 'fs'
import { join } from 'path';
import { json } from 'express';

const defaultDIRPublic = [
  'provider_icon_img',
  'plug_type_icon_img',
  'station_img',
  'review_img',
  'image_ticket_img',
  'user_img',
  'logo_label_img',
  'news_img'
]


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.enableCors()
  app.use(json({ limit: '50mb' }))
    
  if (!fs.existsSync(join(__dirname, '..', 'public'))) {
    fs.mkdirSync(join(__dirname,'..', 'public'));
  }

  for await (const directory of defaultDIRPublic) {
    if (!fs.existsSync(join(__dirname, '..','public',directory))) {
      fs.mkdirSync(join(__dirname, '..', 'public',directory));
    }
  }


  await app.listen(5010);
}
bootstrap();
