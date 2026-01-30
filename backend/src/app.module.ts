import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresConfigService } from '@configs';

@Module({
  imports: [TypeOrmModule.forRootAsync({ useClass: PostgresConfigService })],
})
export class AppModule {}
