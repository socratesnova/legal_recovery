import {
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsNumber,
  IsInt,
} from "class-validator";
import { InstitutionType, EntityStatus } from "@prisma/client";

export class CreateInstitutionDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(InstitutionType)
  type: InstitutionType;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @IsOptional()
  @IsNumber()
  maxDiscountAuto?: number;

  @IsOptional()
  @IsNumber()
  maxDiscountManual?: number;

  @IsOptional()
  @IsInt()
  minInstallments?: number;

  @IsOptional()
  @IsInt()
  maxInstallments?: number;

  @IsOptional()
  @IsNumber()
  autoApprovalLimit?: number;
}
