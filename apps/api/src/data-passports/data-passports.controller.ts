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

import { DataPassportsService } from "./data-passports.service";
import {
  CreateDataPassportDto,
  UpdateDataPassportDto,
} from "./dto/create-data-passport.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("DataPassports")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/data-passports")
export class DataPassportsController {
  constructor(private readonly service: DataPassportsService) {}

  @Get()
  @ApiOperation({
    summary: "List data passports (optionally filtered by case)",
  })
  @ApiQuery({ name: "caseId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of data passports" })
  findAll(
    @Query("caseId") caseId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.findAll(caseId, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single data passport by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Data passport returned" })
  @ApiResponse({ status: 404, description: "Data passport not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.findById(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  @ApiOperation({ summary: "Register a data passport for a case field" })
  @ApiResponse({ status: 201, description: "Data passport created" })
  create(
    @Body() data: CreateDataPassportDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.create(data, user);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  @ApiOperation({ summary: "Update a data passport" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Data passport updated" })
  update(
    @Param("id") id: string,
    @Body() data: UpdateDataPassportDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.update(id, data, user);
  }

  @Post(":id/revoke")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  @ApiOperation({
    summary: "Revoke (block) a data passport, preserving history",
  })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Data passport revoked" })
  revoke(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.revoke(id, user);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: "Permanently delete a data passport (super admin only)",
  })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Data passport deleted" })
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.remove(id, user);
  }
}
