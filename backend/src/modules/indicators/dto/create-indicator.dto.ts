import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIndicatorDto {
  @IsUUID()
  projectId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsNumber()
  currentValue: number;

  @IsNumber()
  threshold: number;
}
