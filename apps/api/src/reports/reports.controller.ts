import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

import { ReportsService } from "./reports.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("kpis")
  @ApiOperation({ summary: "Get dashboard KPIs" })
  @ApiResponse({ status: 200, description: "KPIs returned" })
  getKpis(@CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.getKpis(user);
  }
}
