import { User } from 'src/user/entity/user.entity';

export interface RoleInterface {
  role_id: string;
  name: string;
  users: User[];
}

export enum UserRole {
  Admin = 'Admin',
  Analyst = 'Analyst',
  User = 'User',
}
