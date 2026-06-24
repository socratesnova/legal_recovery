import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { InstitutionsService } from "./institutions.service";
import { Roles, Role } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { CreateInstitutionDto } from "./dto/create-institution.dto";
import { UpdateInstitutionDto } from "./dto/update-institution.dto";

@ApiTags("Institutions")
@ApiBearerAuth()
@Controller("v1/institutions")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BANCO)
  findAll() {
    return this.institutionsService.findAll();
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.BANCO)
  findOne(@Param("id") id: string) {
    return this.institutionsService.findOne(id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() data: CreateInstitutionDto) {
    return this.institutionsService.create(data);
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param("id") id: string, @Body() data: UpdateInstitutionDto) {
    return this.institutionsService.update(id, data);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN)
  remove(@Param("id") id: string) {
    return this.institutionsService.remove(id);
  }
}
