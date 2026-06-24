import { SetMetadata } from "@nestjs/common";
import { UserRole } from "./current-user.decorator";

export { UserRole as Role } from "./current-user.decorator";
export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
