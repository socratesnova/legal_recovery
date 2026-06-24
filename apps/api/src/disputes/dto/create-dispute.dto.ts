import { IsUUID, IsString, IsOptional, MinLength } from "class-validator";

export class CreateDisputeDto {
  @IsUUID()
  caseId: string;

  @IsString()
  @MinLength(3)
  reason: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ResolveDisputeDto {
  @IsOptional()
  @IsString()
  resolution?: string;
}

export class UpdateDisputeDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  resolution?: string;
}
