import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { Roles, Role } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  CurrentUser,
  AuthenticatedUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("v1/users")
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPERVISOR)
  findAll(
    @Query("institutionId") institutionId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.findAll(institutionId, user);
  }

  @Get(":id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPERVISOR, Role.GESTOR)
  findOne(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findById(id, user);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() data: CreateUserDto, @CurrentUser() user: AuthenticatedUser) {
    return this.usersService.create(data, user);
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(
    @Param("id") id: string,
    @Body() data: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.update(id, data, user);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.usersService.remove(id, user);
  }
}
