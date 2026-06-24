export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    SUPERVISOR = "SUPERVISOR",
    GESTOR = "GESTOR",
    ABOGADO = "ABOGADO",
    COMPLIANCE = "COMPLIANCE",
    BANCO = "BANCO",
    DEUDOR = "DEUDOR"
}
export interface AuthenticatedUser {
    userId: string;
    email: string;
    role: UserRole;
    institutionId?: string;
}
export declare const CurrentUser: (...dataOrPipes: (keyof AuthenticatedUser | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
export declare const CurrentInstitution: (...dataOrPipes: unknown[]) => ParameterDecorator;
