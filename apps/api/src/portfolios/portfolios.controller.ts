import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
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
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";

import { PortfoliosService } from "./portfolios.service";
import { PortfolioIngestService } from "./portfolio-ingest.service";
import { PortfolioIngestProducer } from "./portfolio-ingest.producer";
import { PortfolioIngestJobService } from "./portfolio-ingest-job.service";
import { PortfolioRulesService } from "../rules/portfolio-rules.service";
import { UpsertPortfolioRuleDto } from "../rules/dto/upsert-portfolio-rule.dto";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
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

@ApiTags("Portfolios")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/portfolios")
export class PortfoliosController {
  constructor(
    private readonly portfoliosService: PortfoliosService,
    private readonly ingestService: PortfolioIngestService,
    private readonly ingestProducer: PortfolioIngestProducer,
    private readonly ingestJobs: PortfolioIngestJobService,
    private readonly rulesService: PortfolioRulesService,
  ) {}

  @Get()
  @ApiOperation({ summary: "List all portfolios" })
  @ApiResponse({ status: 200, description: "List of portfolios returned" })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.portfoliosService.findAll(user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single portfolio by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Portfolio returned" })
  @ApiResponse({ status: 404, description: "Portfolio not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.portfoliosService.findById(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Create a new portfolio" })
  @ApiResponse({ status: 201, description: "Portfolio created" })
  create(
    @Body() data: CreatePortfolioDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.portfoliosService.create(data, user);
  }

  @Post(":id/upload")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Upload and ingest a portfolio file (CSV/XLSX)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
      required: ["file"],
    },
  })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Ingest summary returned" })
  @ApiResponse({ status: 400, description: "Missing file or unparseable file" })
  @ApiResponse({ status: 404, description: "Portfolio not found" })
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: UPLOAD_MAX_BYTES },
    }),
  )
  upload(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    return this.ingestService.ingest(file, id, user);
  }

  @Post(":id/ingest-async")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(202)
  @ApiOperation({
    summary: "Upload a portfolio file for async ingest (large files)",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
      required: ["file"],
    },
  })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({
    status: 202,
    description: "Ingest job accepted; returns jobId to poll",
  })
  @ApiResponse({ status: 400, description: "Missing file" })
  @ApiResponse({
    status: 403,
    description: "Portfolio belongs to another institution",
  })
  @ApiResponse({ status: 404, description: "Portfolio not found" })
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: UPLOAD_MAX_BYTES },
    }),
  )
  ingestAsync(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    return this.ingestProducer.enqueue(file, id, user);
  }

  @Get(":id/ingest-jobs")
  @ApiOperation({ summary: "List async ingest jobs for a portfolio" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "List of ingest jobs returned" })
  listIngestJobs(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ingestJobs.findByPortfolio(id, user);
  }

  @Get(":id/ingest-jobs/:jobId")
  @ApiOperation({ summary: "Get the status of an async ingest job" })
  @ApiParam({ name: "id", type: String })
  @ApiParam({ name: "jobId", type: String })
  @ApiResponse({ status: 200, description: "Ingest job returned" })
  @ApiResponse({ status: 404, description: "Ingest job not found" })
  getIngestJob(
    @Param("id") id: string,
    @Param("jobId") jobId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ingestJobs.findOne(id, jobId, user);
  }

  @Get(":id/rules")
  @ApiOperation({ summary: "Get the rules configured for a portfolio" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({
    status: 200,
    description: "Portfolio rules returned (or null)",
  })
  @ApiResponse({ status: 404, description: "Portfolio not found" })
  getRules(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.rulesService.getForPortfolio(id, user);
  }

  @Put(":id/rules")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Create or update the rules for a portfolio" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Portfolio rules upserted" })
  @ApiResponse({
    status: 403,
    description: "Portfolio belongs to another institution",
  })
  @ApiResponse({ status: 404, description: "Portfolio not found" })
  upsertRules(
    @Param("id") id: string,
    @Body() data: UpsertPortfolioRuleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.rulesService.upsertForPortfolio(id, data, user);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Update an existing portfolio" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Portfolio updated" })
  @ApiResponse({ status: 404, description: "Portfolio not found" })
  update(
    @Param("id") id: string,
    @Body() data: UpdatePortfolioDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.portfoliosService.update(id, data, user);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Soft-delete a portfolio" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Portfolio soft-deleted" })
  @ApiResponse({ status: 404, description: "Portfolio not found" })
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.portfoliosService.remove(id, user);
  }
}
