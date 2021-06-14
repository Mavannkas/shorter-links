import { User } from 'src/user/entity/user.entity';

export interface RoleInterface {
  role_id: string;
  name: string;
  deleted: boolean;
  users: User[];
}

export enum UserRole {
  Admin = 'Admin',
  Analyst = 'Analyst',
  User = 'User',
}

export interface RoleResponse {
  role_id: string;
  name: string;
}

export type RolesListResponse = RoleResponse[];

export interface DeleteRoleResponse {
  ok: string;
}
