import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  IsArray,
  MinLength,
} from "class-validator";
import { PassportStatus } from "@prisma/client";

export class CreateDataPassportDto {
  @IsUUID()
  caseId: string;

  @IsString()
  @MinLength(2)
  entityType: string;

  @IsUUID()
  entityId: string;

  @IsString()
  @MinLength(1)
  fieldName: string;

  @IsOptional()
  @IsString()
  fieldValueHash?: string;

  @IsString()
  @MinLength(2)
  sourceType: string;

  @IsOptional()
  @IsString()
  sourceReference?: string;

  @IsString()
  @MinLength(2)
  legalBasis: string;

  @IsArray()
  @IsString({ each: true })
  allowedUses: string[];

  @IsArray()
  @IsString({ each: true })
  prohibitedUses: string[];

  @IsOptional()
  @IsInt()
  confidenceScore?: number;

  @IsArray()
  @IsString({ each: true })
  visibilityRoles: string[];

  @IsOptional()
  @IsEnum(PassportStatus)
  status?: PassportStatus;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}

export class UpdateDataPassportDto {
  @IsOptional()
  @IsString()
  fieldValueHash?: string;

  @IsOptional()
  @IsString()
  sourceReference?: string;

  @IsOptional()
  @IsString()
  legalBasis?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedUses?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prohibitedUses?: string[];

  @IsOptional()
  @IsInt()
  confidenceScore?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  visibilityRoles?: string[];

  @IsOptional()
  @IsEnum(PassportStatus)
  status?: PassportStatus;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsDateString()
  lastValidatedAt?: string;
}
