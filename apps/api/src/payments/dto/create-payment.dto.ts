import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
} from "class-validator";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export class CreatePaymentDto {
  @IsUUID()
  caseId: string;

  @IsUUID()
  institutionId: string;

  @IsOptional()
  @IsUUID()
  agreementId?: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  receiptPath?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
