import { IsUUID, IsEnum, IsOptional, IsString } from "class-validator";
import { ConsentType } from "@prisma/client";

export class GrantConsentDto {
  @IsUUID()
  debtorId: string;

  @IsEnum(ConsentType)
  type: ConsentType;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
