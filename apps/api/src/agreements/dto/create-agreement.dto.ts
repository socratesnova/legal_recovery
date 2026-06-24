import { IsUUID, IsOptional, IsEnum, IsNumber, IsInt } from "class-validator";
import { AgreementType, AgreementStatus } from "@prisma/client";

export class CreateAgreementDto {
  @IsUUID()
  caseId: string;

  @IsUUID()
  institutionId: string;

  @IsEnum(AgreementType)
  type: AgreementType;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

  @IsOptional()
  @IsInt()
  installments?: number;

  @IsOptional()
  @IsEnum(AgreementStatus)
  status?: AgreementStatus;
}
