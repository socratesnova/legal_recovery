import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersModule } from "../users/users.module";
import { assertValidJwtSecret } from "../config/secrets";

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    // The JWT secret is resolved lazily (registerAsync) so it is read AFTER
    // ConfigModule has loaded .env into ConfigService, and validated fail-fast
    // via assertValidJwtSecret. This replaces the old `JWT_SECRET ||
    // "default-secret"` fallback — a critical hole that let anyone who read the
    // source forge valid JWTs, and which also caused a sign/verify mismatch
    // (signing fell back to "default-secret" while verifying read the raw,
    // possibly-undefined env var).
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: assertValidJwtSecret(config.get<string>("JWT_SECRET")),
        signOptions: {
          expiresIn: config.get<string>("JWT_EXPIRATION") || "3600s",
        } as JwtModuleOptions["signOptions"],
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
