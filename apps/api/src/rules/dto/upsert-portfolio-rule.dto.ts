import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

/**
 * Upsert body for a portfolio's rules (`PortfolioRule`, 1:1 with the portfolio).
 * Every field is optional; omitted fields are left untouched on update.
 */
export class UpsertPortfolioRuleDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountMax?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  minInstallments?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxInstallments?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  autoApprovalLimit?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  channelsAllowed?: string[];
}
