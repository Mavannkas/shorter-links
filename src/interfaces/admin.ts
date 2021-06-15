import { Token } from 'src/auth/entity/token.entity';
import { Role } from 'src/roles/entity/role.entity';
import { RedirectLink } from 'src/shorten/entity/redirect-link.entity';

export interface UserMinimalData {
  user_id: string;
  name: string;
  email: string;
  created_at: Date;
}

export interface UserExtendedData {
  user_id: string;
  name: string;
  email: string;
  created_at: Date;
  roles: Role[];
  tokens: Token[];
  redirect_links: RedirectLink[];
}

export type UserRolesResponse = Role[];
export type UserTokensResponse = Token[];
export type UserRedirectsResponse = RedirectLink[];
export type AllUsersResponse = UserMinimalData[];
export type UserResponse = UserExtendedData;
