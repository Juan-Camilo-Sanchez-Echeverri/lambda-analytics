import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  IsUUID,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ActivityStatus } from '../enums/activity-status.enum';

export class CreateActivityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(ActivityStatus)
  status?: ActivityStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsUUID()
  projectId: string;
}
