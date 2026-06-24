import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Auth")
@Controller("v1/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("healthz")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Health check" })
  healthz() {
    return { status: "ok" };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(user);
  }
}
