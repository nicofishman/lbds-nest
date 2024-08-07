import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodFilter } from 'src/filters/zod.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.useGlobalFilters(new ZodFilter());
  await app.listen(3000);
}
bootstrap();
