import { IsEnum, IsOptional } from 'class-validator';

import { PaginationDto } from '@common/dto/pagination.dto';

import { ActivityStatus } from '../enums/activity-status.enum';

export class FilterActivityDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ActivityStatus)
  status?: ActivityStatus;
}
