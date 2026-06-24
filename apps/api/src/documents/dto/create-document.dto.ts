import { IsString, IsUUID, IsInt, MinLength } from "class-validator";

export class CreateDocumentDto {
  @IsUUID()
  caseId: string;

  @IsString()
  @MinLength(1)
  filename: string;

  @IsString()
  @MinLength(1)
  filePath: string;

  @IsString()
  @MinLength(1)
  fileHash: string;

  @IsString()
  @MinLength(1)
  mimeType: string;

  @IsInt()
  sizeBytes: number;
}
