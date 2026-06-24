import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

import { AuditService } from "./audit.service";
import { QueryAuditDto } from "./dto/query-audit.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Audit")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/audit")
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMPLIANCE)
  @ApiOperation({ summary: "Query the immutable audit log (scoped by tenant)" })
  @ApiQuery({ name: "institutionId", required: false, type: String })
  @ApiQuery({ name: "action", required: false, type: String })
  @ApiQuery({ name: "entityType", required: false, type: String })
  @ApiQuery({ name: "entityId", required: false, type: String })
  @ApiQuery({ name: "userId", required: false, type: String })
  @ApiQuery({ name: "from", required: false, type: String })
  @ApiQuery({ name: "to", required: false, type: String })
  @ApiQuery({ name: "skip", required: false, type: Number })
  @ApiQuery({ name: "take", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Paginated audit log entries" })
  findAll(
    @Query() query: QueryAuditDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.findAll(query, user);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMPLIANCE)
  @ApiOperation({ summary: "Get a single audit log entry by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Audit entry returned" })
  @ApiResponse({ status: 404, description: "Audit entry not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.findById(id, user);
  }
}
