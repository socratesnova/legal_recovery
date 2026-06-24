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
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

import { AgreementsService } from "./agreements.service";
import { CreateAgreementDto } from "./dto/create-agreement.dto";
import { UpdateAgreementDto } from "./dto/update-agreement.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Agreements")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/agreements")
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Get()
  @ApiOperation({ summary: "List agreements" })
  @ApiQuery({ name: "caseId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of agreements returned" })
  findAll(
    @Query("caseId") caseId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.agreementsService.findAll(caseId, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single agreement by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Agreement returned" })
  @ApiResponse({ status: 404, description: "Agreement not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.agreementsService.findById(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTOR)
  @ApiOperation({ summary: "Create a new agreement" })
  @ApiResponse({ status: 201, description: "Agreement created" })
  create(
    @Body() data: CreateAgreementDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.agreementsService.create(data, user);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTOR)
  @ApiOperation({ summary: "Update an agreement" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Agreement updated" })
  @ApiResponse({ status: 404, description: "Agreement not found" })
  update(
    @Param("id") id: string,
    @Body() data: UpdateAgreementDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.agreementsService.update(id, data, user);
  }

  @Post(":id/approve")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Approve an agreement" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Agreement approved" })
  @ApiResponse({ status: 404, description: "Agreement not found" })
  approve(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.agreementsService.approve(id, user);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Soft-delete an agreement" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Agreement soft-deleted" })
  @ApiResponse({ status: 404, description: "Agreement not found" })
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.agreementsService.remove(id, user);
  }
}
