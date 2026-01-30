import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  generatedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
