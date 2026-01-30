import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { envs } from './envs.config';

export class PostgresConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      ssl: false,
      extra: {
        ssl: false,
      },
      type: 'postgres',
      host: envs.dbHost,
      port: Number(envs.dbPort),
      database: envs.dbName,
      username: envs.dbUsername,
      password: envs.dbPassword,
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
