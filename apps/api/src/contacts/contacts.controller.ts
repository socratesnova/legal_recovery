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

import { ContactsService } from "./contacts.service";
import { CreateContactDto, UpdateContactDto } from "./dto/create-contact.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Contacts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/contacts")
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Get()
  @ApiOperation({ summary: "List contacts (optionally filtered by debtor)" })
  @ApiQuery({ name: "debtorId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of contacts" })
  findAll(
    @Query("debtorId") debtorId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.findAll(debtorId, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single contact by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Contact returned" })
  @ApiResponse({ status: 404, description: "Contact not found" })
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
  @ApiOperation({ summary: "Create a contact for a debtor" })
  @ApiResponse({ status: 201, description: "Contact created" })
  create(
    @Body() data: CreateContactDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.create(data, user);
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
  @ApiOperation({ summary: "Update a contact" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Contact updated" })
  update(
    @Param("id") id: string,
    @Body() data: UpdateContactDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.update(id, data, user);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  @ApiOperation({ summary: "Soft-delete a contact" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Contact soft-deleted" })
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.remove(id, user);
  }
}
