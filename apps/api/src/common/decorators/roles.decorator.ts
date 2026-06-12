import { SetMetadata } from '@nestjs/common';

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  GESTOR = 'gestor',
  ABOGADO = 'abogado',
  COMPLIANCE = 'compliance',
  BANCO = 'banco',
  DEUDOR = 'deudor',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
