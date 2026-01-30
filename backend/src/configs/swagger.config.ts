import { INestApplication } from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Lambda Analytics API')
  .setDescription('The API for Lambda Analytics application')
  .setVersion('1.0.0')
  .addGlobalResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        code: { type: 'null' },
        status: { type: 'number' },
        path: { type: 'string' },
        details: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              property: { type: 'null' },
              errors: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
      },
    },
    example: {
      error: '',
      code: null,
      status: 500,
      path: '/api/v1.0/users',
      details: [
        {
          property: null,
          errors: ['Internal server error'],
        },
      ],
    },
  })
  .addBearerAuth()
  .build();

const swaggerDocOptions: SwaggerDocumentOptions = {
  ignoreGlobalPrefix: false,
  operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
};

export const setupSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerDocOptions,
  );

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
      tagsSorter: 'alpha',
      defaultModelsExpandDepth: -1,
    },
  });
};
