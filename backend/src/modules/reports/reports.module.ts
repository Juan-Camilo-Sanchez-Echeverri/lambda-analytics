import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from '@modules/projects/projects.module';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

import { Report } from './entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), ProjectsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
