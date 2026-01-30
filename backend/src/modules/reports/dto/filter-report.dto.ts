import { IsDateString, IsOptional, IsUUID } from 'class-validator';

import { PaginationDto } from '@common/dto/pagination.dto';

export class FilterReportDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
