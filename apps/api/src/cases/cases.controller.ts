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
  ApiResponse,
} from "@nestjs/swagger";

import { CasesService } from "./cases.service";
import { CreateCaseDto } from "./dto/create-case.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";
import { CaseFilterDto } from "./dto/filter-case.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Cases")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/cases")
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @ApiOperation({ summary: "List cases with optional filters" })
  @ApiResponse({ status: 200, description: "List of cases returned" })
  findAll(
    @Query() filter: CaseFilterDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.casesService.findAll(filter, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single case by ID with full relations" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Case returned" })
  @ApiResponse({ status: 404, description: "Case not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.casesService.findById(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTOR)
  @ApiOperation({ summary: "Create a new case" })
  @ApiResponse({ status: 201, description: "Case created" })
  create(@Body() data: CreateCaseDto, @CurrentUser() user: AuthenticatedUser) {
    return this.casesService.create(data, user);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTOR)
  @ApiOperation({ summary: "Update an existing case" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Case updated" })
  @ApiResponse({ status: 404, description: "Case not found" })
  update(
    @Param("id") id: string,
    @Body() data: UpdateCaseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.casesService.update(id, data, user);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Soft-delete a case" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Case soft-deleted" })
  @ApiResponse({ status: 404, description: "Case not found" })
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.casesService.remove(id, user);
  }
}
