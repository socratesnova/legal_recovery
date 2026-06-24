import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Ip,
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

import { CommunicationsService } from "./communications.service";
import {
  CreateCommunicationDto,
  UpdateCommunicationDto,
} from "./dto/create-communication.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Communications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/communications")
export class CommunicationsController {
  constructor(private readonly service: CommunicationsService) {}

  @Get()
  @ApiOperation({
    summary: "List communications (optionally filtered by case)",
  })
  @ApiQuery({ name: "caseId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of communications" })
  findAll(
    @Query("caseId") caseId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.findAll(caseId, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single communication by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Communication returned" })
  @ApiResponse({ status: 404, description: "Communication not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.findById(id, user);
  }

  @Post()
  @Roles(
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.GESTOR,
    Role.SUPERVISOR,
    Role.ABOGADO,
    Role.COMPLIANCE,
  )
  @ApiOperation({
    summary:
      "Attempt a contact. The Legal Firewall is evaluated; blocked attempts are recorded with status=BLOCKED.",
  })
  @ApiResponse({ status: 201, description: "Communication recorded" })
  create(
    @Body() data: CreateCommunicationDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.service.create(data, user, ip);
  }

  @Patch(":id")
  @Roles(
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.GESTOR,
    Role.SUPERVISOR,
    Role.ABOGADO,
    Role.COMPLIANCE,
  )
  @ApiOperation({ summary: "Update a communication (status/content)" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Communication updated" })
  update(
    @Param("id") id: string,
    @Body() data: UpdateCommunicationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.update(id, data, user);
  }
}
