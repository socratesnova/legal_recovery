import { IsOptional, IsEnum, IsUUID, IsString } from "class-validator";
import { CaseStatus } from "@prisma/client";

export class CaseFilterDto {
  @IsOptional()
  @IsUUID()
  institutionId?: string;

  @IsOptional()
  @IsUUID()
  portfolioId?: string;

  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  debtorId?: string;
}
