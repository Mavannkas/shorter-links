import { Token } from 'src/auth/entity/token.entity';
import { Role } from 'src/roles/entity/role.entity';
import { RedirectLink } from 'src/shorten/entity/redirect-link.entity';
import { TokenResponse } from './auth';

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
  tokens: TokenResponse[];
  redirect_links: RedirectLink[];
}

export type UserRolesResponse = Role[];
export type UserTokensResponse = TokenResponse[];
export type UserRedirectsResponse = RedirectLink[];
export type AllUsersResponse = UserMinimalData[];
export type UserResponse = UserExtendedData;
