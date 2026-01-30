import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto {
  /**
   * The number of items to return per page.
   * Defaults to 10 if not provided.
   */
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  /**
   * The page number to return.
   * Defaults to 1 if not provided.
   */
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsEnum(Order)
  order?: Order;

  @IsOptional()
  @IsString()
  q?: string;
}
