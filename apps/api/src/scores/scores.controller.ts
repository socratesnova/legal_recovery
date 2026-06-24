import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

import { ScoringService } from "./scoring.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles, Role } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Scores")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Controller("v1/scores")
export class ScoresController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post("case/:caseId")
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPERVISOR, Role.GESTOR)
  @ApiOperation({
    summary: "Recalculate scores and Next Best Action for a case",
  })
  @ApiParam({ name: "caseId", type: String })
  @ApiResponse({ status: 200, description: "Scores computed and persisted" })
  @ApiResponse({ status: 404, description: "Case not found" })
  @ApiResponse({
    status: 403,
    description: "Case belongs to another institution",
  })
  score(
    @Param("caseId") caseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.scoringService.scoreCase(caseId, user);
  }

  @Get("case/:caseId")
  @Roles(
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.SUPERVISOR,
    Role.GESTOR,
    Role.ABOGADO,
    Role.COMPLIANCE,
  )
  @ApiOperation({ summary: "Get the persisted scores for a case" })
  @ApiParam({ name: "caseId", type: String })
  @ApiResponse({ status: 200, description: "Persisted scores returned" })
  @ApiResponse({ status: 404, description: "Case not found" })
  getScores(
    @Param("caseId") caseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.scoringService.getScores(caseId, user);
  }
}
