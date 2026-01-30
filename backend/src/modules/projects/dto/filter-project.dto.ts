import { IsEnum, IsOptional } from 'class-validator';

import { PaginationDto } from '@common/dto/pagination.dto';

import { ProjectStatus } from '../enums/project-status.enum';

export class FilterProjectDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
