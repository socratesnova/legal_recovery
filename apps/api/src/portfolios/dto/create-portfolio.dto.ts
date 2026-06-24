import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  MinLength,
} from "class-validator";
import { PortfolioType, PortfolioStatus } from "@prisma/client";

export class CreatePortfolioDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsUUID()
  institutionId: string;

  @IsEnum(PortfolioType)
  type: PortfolioType;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  fileSource?: string;

  @IsOptional()
  @IsDateString()
  uploadDate?: string;

  @IsOptional()
  @IsEnum(PortfolioStatus)
  status?: PortfolioStatus;
}
