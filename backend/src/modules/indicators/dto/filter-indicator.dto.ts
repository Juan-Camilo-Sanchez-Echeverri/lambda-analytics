import { IsBooleanString, IsOptional, IsUUID } from 'class-validator';

import { PaginationDto } from '@common/dto/pagination.dto';

export class FilterIndicatorDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsBooleanString()
  criticalOnly?: string;
}
