import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { UserRole } from "../common/decorators/current-user.decorator";
interface LoginUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    institutionId?: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<LoginUser | null>;
    login(user: LoginUser): {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: UserRole;
            institutionId: string;
        };
    };
    validateToken(token: string): Promise<any>;
}
export {};
