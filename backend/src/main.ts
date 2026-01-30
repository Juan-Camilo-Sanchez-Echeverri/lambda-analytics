import { NestFactory } from '@nestjs/core';

import {
  ConsoleLogger,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

import { NestExpressApplication } from '@nestjs/platform-express';

import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

import { envs, setupSwagger } from '@configs';

import { getClassValidatorErrors } from '@common/helpers';

const logger = new ConsoleLogger({ prefix: 'Erotic Site' });

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
   * Enable CORS with the specified configuration.
   */
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  /**
   * Use global pipes.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors): UnprocessableEntityException => {
        const message = 'Validation failed';
        const details = getClassValidatorErrors(validationErrors);

        return new UnprocessableEntityException({ message, details });
      },
    }),
  );

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

  /**
   * Create the swagger document and setup the swagger module.
   */
  setupSwagger(app);

  await app.listen(envs.port);
  logger.log(`Server running on ${envs.port} 🚀 in ${envs.nodeEnv}`);
  logger.log(`API documentation available at /docs 📚`);
}

bootstrap().catch((err) => {
  logger.error('Error during app bootstrap', err);
  process.exit(1);
});
