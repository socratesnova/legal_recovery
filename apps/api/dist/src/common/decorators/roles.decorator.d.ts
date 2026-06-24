import { UserRole } from "./current-user.decorator";
export { UserRole as Role } from "./current-user.decorator";
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
