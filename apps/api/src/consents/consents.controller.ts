import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
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
import { ConsentType } from "@prisma/client";

import { ConsentsService } from "./consents.service";
import { GrantConsentDto } from "./dto/grant-consent.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Consents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/consents")
export class ConsentsController {
  constructor(private readonly service: ConsentsService) {}

  @Get()
  @ApiOperation({ summary: "List consents (optionally filtered by debtor)" })
  @ApiQuery({ name: "debtorId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of consents" })
  findAll(
    @Query("debtorId") debtorId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.findAll(debtorId, user);
  }

  @Get("debtor/:debtorId")
  @ApiOperation({ summary: "Full consent history for a debtor" })
  @ApiParam({ name: "debtorId", type: String })
  @ApiResponse({ status: 200, description: "Consent history" })
  findByDebtor(
    @Param("debtorId") debtorId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.findByDebtor(debtorId, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single consent by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Consent returned" })
  @ApiResponse({ status: 404, description: "Consent not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.findById(id, user);
  }

  @Post("grant")
  @Roles(
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.COMPLIANCE,
    Role.GESTOR,
    Role.ABOGADO,
  )
  @ApiOperation({ summary: "Record a consent grant (opt-in)" })
  @ApiResponse({ status: 201, description: "Consent granted" })
  grant(@Body() data: GrantConsentDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.grant(data, user);
  }

  @Post(":id/revoke")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  @ApiOperation({
    summary: "Revoke a consent by ID (appends a revocation row)",
  })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 201, description: "Consent revoked" })
  revoke(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.revoke(id, user);
  }

  @Post("debtor/:debtorId/revoke")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  @ApiOperation({ summary: "Revoke the active consent of a type for a debtor" })
  @ApiParam({ name: "debtorId", type: String })
  @ApiQuery({ name: "type", required: true, enum: ConsentType })
  @ApiResponse({ status: 201, description: "Consent revoked" })
  revokeByType(
    @Param("debtorId") debtorId: string,
    @Query("type") type: ConsentType,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.revokeByType(debtorId, type, user);
  }
}
