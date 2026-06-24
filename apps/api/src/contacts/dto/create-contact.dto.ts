import {
  IsUUID,
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from "class-validator";
import { ContactChannel } from "@prisma/client";

export class CreateContactDto {
  @IsUUID()
  debtorId: string;

  @IsEnum(ContactChannel)
  channel: ContactChannel;

  @IsString()
  value: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsBoolean()
  optIn?: boolean;

  @IsOptional()
  @IsDateString()
  optInDate?: string;

  @IsOptional()
  @IsUUID()
  dataPassportId?: string;
}

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsBoolean()
  optIn?: boolean;

  @IsOptional()
  @IsDateString()
  optInDate?: string;

  @IsOptional()
  @IsUUID()
  dataPassportId?: string;
}
