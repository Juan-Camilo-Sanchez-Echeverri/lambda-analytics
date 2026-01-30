import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from '@modules/projects/projects.module';

import { IndicatorsController } from './indicators.controller';

import { IndicatorsService } from './indicators.service';

import { Indicator } from './entities/indicator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Indicator]), ProjectsModule],
  controllers: [IndicatorsController],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}
