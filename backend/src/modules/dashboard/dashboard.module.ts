import { Module } from '@nestjs/common';

import { ProjectsModule } from '@modules/projects/projects.module';
import { IndicatorsModule } from '@modules/indicators/indicators.module';
import { DashboardController } from './dashboard.controller';

import { DashboardService } from './dashboard.service';

@Module({
  imports: [ProjectsModule, IndicatorsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
