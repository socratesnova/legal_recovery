import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    healthz(): {
        status: string;
    };
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../common/decorators/current-user.decorator").UserRole;
            institutionId: string;
        };
    }>;
}
