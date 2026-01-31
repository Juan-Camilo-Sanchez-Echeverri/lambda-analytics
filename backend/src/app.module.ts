import { APP_FILTER } from '@nestjs/core';

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresConfigService } from '@configs';

import { HttpExceptionFilter, TypeOrmExceptionFilter } from '@common/filters';

import { ProjectsModule } from '@modules/projects/projects.module';
import { ActivitiesModule } from '@modules/activities/activities.module';
import { IndicatorsModule } from '@modules/indicators/indicators.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: PostgresConfigService }),
    ProjectsModule,
    ActivitiesModule,
    IndicatorsModule,
    ReportsModule,
    DashboardModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: TypeOrmExceptionFilter },
  ],
})
export class AppModule {}
