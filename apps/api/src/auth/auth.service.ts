import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { UserRole } from "../common/decorators/current-user.decorator";

interface LoginUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institutionId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<LoginUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return {
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role as UserRole,
      institutionId: result.institutionId ?? undefined,
    };
  }

  login(user: LoginUser) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      institutionId: user.institutionId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        institutionId: user.institutionId,
      },
    };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
