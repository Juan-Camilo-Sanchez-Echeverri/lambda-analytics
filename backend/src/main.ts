import { NestFactory } from '@nestjs/core';

import { ConsoleLogger, VersioningType } from '@nestjs/common';

import { NestExpressApplication } from '@nestjs/platform-express';

import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

const logger = new ConsoleLogger({ prefix: 'Analytics Backend' });

async function bootstrap(): Promise<void> {
  /**
   * Create the application.
   */
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  /**
   * Use helmet and compression for security and performance.
   */
  app.use(compression());
  app.use(helmet());

  /**
   * Set various application settings.
   */
  app.set('trust proxy', true);
  app.set('query parser', 'extended');

  /**
   * Set the global prefix.
   */
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1.0',
  });

  await app.listen(3000);
  logger.log(`Server running on ${3000}`);
}

bootstrap().catch((err) => {
  logger.error('Error during app bootstrap', err);
  process.exit(1);
});
