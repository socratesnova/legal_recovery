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

import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Payments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: "List payments" })
  @ApiQuery({ name: "caseId", required: false, type: String })
  @ApiResponse({ status: 200, description: "List of payments returned" })
  findAll(
    @Query("caseId") caseId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.findAll(caseId, user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single payment by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Payment returned" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.findById(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTOR)
  @ApiOperation({ summary: "Create a new payment record" })
  @ApiResponse({ status: 201, description: "Payment created" })
  create(
    @Body() data: CreatePaymentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.create(data, user);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GESTOR)
  @ApiOperation({ summary: "Update a payment" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Payment updated" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  update(
    @Param("id") id: string,
    @Body() data: UpdatePaymentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.update(id, data, user);
  }

  @Post(":id/reconcile")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE)
  @ApiOperation({ summary: "Reconcile a payment" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Payment reconciled" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  reconcile(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.reconcile(id, user);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: "Soft-delete a payment" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Payment soft-deleted" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.remove(id, user);
  }
}
