import {
  Controller,
  Get,
  Post,
  Patch,
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

import { DisputesService } from "./disputes.service";
import {
  CreateDisputeDto,
  ResolveDisputeDto,
  UpdateDisputeDto,
} from "./dto/create-dispute.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Disputes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/disputes")
export class DisputesController {
  constructor(private readonly service: DisputesService) {}

  @Get()
  @ApiOperation({ summary: "List disputes (optionally filtered by case)" })
  @ApiQuery({ name: "caseId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of disputes" })
  findAll(
    @Query("caseId") caseId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.findAll(caseId, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single dispute by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Dispute returned" })
  @ApiResponse({ status: 404, description: "Dispute not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.findById(id, user);
  }

  @Post()
  @Roles(
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.GESTOR,
    Role.ABOGADO,
    Role.COMPLIANCE,
  )
  @ApiOperation({ summary: "Open a dispute on a case (pauses management)" })
  @ApiResponse({ status: 201, description: "Dispute opened" })
  create(
    @Body() data: CreateDisputeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.open(data, user);
  }

  @Patch(":id")
  @Roles(
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.GESTOR,
    Role.ABOGADO,
    Role.COMPLIANCE,
  )
  @ApiOperation({ summary: "Update dispute reason/description/resolution" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Dispute updated" })
  update(
    @Param("id") id: string,
    @Body() data: UpdateDisputeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.update(id, data, user);
  }

  @Post(":id/escalate")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  @ApiOperation({ summary: "Escalate a dispute" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Dispute escalated" })
  escalate(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.escalate(id, user);
  }

  @Post(":id/resolve")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  @ApiOperation({ summary: "Resolve a dispute (re-enables management)" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Dispute resolved" })
  resolve(
    @Param("id") id: string,
    @Body() data: ResolveDisputeDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.resolve(id, data, user);
  }
}
