import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  ValidateNested,
  ArrayMinSize,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { CaseStatus } from "@prisma/client";

class CreateDebtorDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @MinLength(5)
  idNumber: string;

  @IsOptional()
  @IsString()
  idType?: string;
}

class CreateCaseProductDto {
  @IsString()
  @MinLength(2)
  productType: string;

  @IsNumber()
  originalAmount: number;

  @IsNumber()
  currentBalance: number;

  @IsOptional()
  @IsNumber()
  interestRate?: number;
}

export class CreateCaseDto {
  @IsString()
  @MinLength(3)
  caseNumber: string;

  @IsUUID()
  institutionId: string;

  @IsUUID()
  portfolioId: string;

  @IsOptional()
  @IsUUID()
  debtorId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDebtorDto)
  debtor?: CreateDebtorDto;

  @IsNumber()
  totalBalance: number;

  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @IsOptional()
  @IsNumber()
  scoreDocumental?: number;

  @IsOptional()
  @IsNumber()
  scoreRecoverability?: number;

  @IsOptional()
  @IsNumber()
  scoreContactability?: number;

  @IsOptional()
  @IsNumber()
  scoreRisk?: number;

  @IsOptional()
  @IsString()
  nextAction?: string;

  @IsOptional()
  @IsDateString()
  nextActionDate?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCaseProductDto)
  @ArrayMinSize(1)
  products?: CreateCaseProductDto[];
}
