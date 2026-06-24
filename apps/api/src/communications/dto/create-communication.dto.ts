import { IsUUID, IsEnum, IsString, IsOptional } from "class-validator";
import { CommChannel, CommDirection, CommStatus } from "@prisma/client";

export class CreateCommunicationDto {
  @IsUUID()
  caseId: string;

  @IsOptional()
  @IsUUID()
  contactId?: string;

  @IsEnum(CommChannel)
  channel: CommChannel;

  @IsOptional()
  @IsEnum(CommDirection)
  direction?: CommDirection;

  @IsOptional()
  @IsString()
  contentSummary?: string;
}

export class UpdateCommunicationDto {
  @IsOptional()
  @IsString()
  contentSummary?: string;

  @IsOptional()
  @IsEnum(CommStatus)
  status?: CommStatus;
}
