import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";

import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { UploadDocumentDto } from "./dto/upload-document.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

const UPLOAD_MAX_BYTES = Number(
  process.env.UPLOAD_MAX_BYTES ?? 50 * 1024 * 1024,
);

@ApiTags("Documents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: "List documents" })
  @ApiQuery({ name: "caseId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of documents returned" })
  findAll(
    @Query("caseId") caseId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.findAll(caseId, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single document by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Document returned" })
  @ApiResponse({ status: 404, description: "Document not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.documentsService.findById(id, user);
  }

  @Get(":id/download")
  @ApiOperation({ summary: "Get a short-lived presigned download URL" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Presigned download URL" })
  @ApiResponse({ status: 404, description: "Document not found" })
  getDownloadUrl(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.getDownloadUrl(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTOR, Role.ABOGADO)
  @ApiOperation({ summary: "Create a new document record" })
  @ApiResponse({ status: 201, description: "Document created" })
  create(
    @Body() data: CreateDocumentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.create(data, user);
  }

  @Post("upload")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTOR, Role.ABOGADO)
  @ApiOperation({ summary: "Upload a file to object storage and register it" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        caseId: { type: "string", format: "uuid" },
        file: { type: "string", format: "binary" },
      },
      required: ["caseId", "file"],
    },
  })
  @ApiResponse({ status: 201, description: "Document uploaded" })
  @ApiResponse({ status: 400, description: "Missing file or caseId" })
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: UPLOAD_MAX_BYTES },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    return this.documentsService.upload(file, dto.caseId, user);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTOR, Role.ABOGADO)
  @ApiOperation({ summary: "Update a document record" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Document updated" })
  @ApiResponse({ status: 404, description: "Document not found" })
  update(
    @Param("id") id: string,
    @Body() data: UpdateDocumentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.update(id, data, user);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Soft-delete a document" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Document soft-deleted" })
  @ApiResponse({ status: 404, description: "Document not found" })
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.documentsService.remove(id, user);
  }
}
