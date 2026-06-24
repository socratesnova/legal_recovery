import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";
import {
  AuthenticatedUser,
  UserRole,
} from "../../common/decorators/current-user.decorator";
import { assertValidJwtSecret } from "../../config/secrets";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: assertValidJwtSecret(config.get<string>("JWT_SECRET")),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
    institutionId?: string;
  }): Promise<AuthenticatedUser> {
    const user = await this.usersService.findById(payload.sub, {
      userId: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
      institutionId: payload.institutionId,
    });
    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedException();
    }
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
      institutionId: payload.institutionId,
    };
  }
}
