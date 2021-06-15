import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserInfo } from 'os';
import { Token } from 'src/auth/entity/token.entity';
import {
  AllUsersResponse,
  UserExtendedData,
  UserMinimalData,
  UserRedirectsResponse,
  UserResponse,
  UserRolesResponse,
  UserTokensResponse,
} from 'src/interfaces/admin';
import { Role } from 'src/roles/entity/role.entity';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,
  ) {}

  async getAllUsers(): Promise<AllUsersResponse> {
    const users = await this.userService.getAllUsers();
    return users.map(this.filterUserResponse);
  }

  async getUser(id: string): Promise<UserResponse> {
    const user = await this.userService.getUserById(id);
    return this.filterExtendedUserResponse(user);
  }

  filterUserResponse({ name, email, user_id, created_at }): UserMinimalData {
    return {
      name,
      email,
      user_id,
      created_at,
    };
  }

  filterExtendedUserResponse({
    name,
    email,
    user_id,
    created_at,
    roles,
    tokens,
    redirect_links,
  }): UserExtendedData {
    return {
      name,
      email,
      user_id,
      created_at,
      roles,
      tokens,
      redirect_links,
    };
  }

  async getUserRoles(id: string): Promise<UserRolesResponse> {
    const user = await this.userService.getUserById(id);
    return user.roles;
  }

  async addUserRole(id: string, { name }): Promise<UserRolesResponse> {
    const role = await this.rolesService.getRoleByName(name);
    const user = await this.userService.getUserById(id);

    if (user.roles.some((item: Role) => item.name === name)) {
      throw new ForbiddenException('This role is given');
    }

    user.roles.push(role);

    await user.save();

    return user.roles;
  }

  async deleteUserRole(id: string, roleId: string): Promise<UserRolesResponse> {
    const user = await this.userService.getUserById(id);

    user.roles = user.roles.filter((item: Role) => item.role_id !== roleId);

    await user.save();
    return user.roles;
  }

  async getUserTokens(id: string): Promise<UserTokensResponse> {
    const user = await this.userService.getUserById(id);
    return user.tokens;
  }

  async deleteUserToken(
    id: string,
    tokenId: string,
  ): Promise<UserTokensResponse> {
    const user = await this.userService.getUserById(id);

    const [token] = user.tokens.filter(
      (item: Token) => item.token_id === tokenId,
    );

    user.tokens = user.tokens.filter(
      (item: Token) => item.token_id !== tokenId,
    );

    if (!token) {
      throw new NotFoundException('This token not exists');
    }

    await token.remove();
    return user.tokens;
  }

  async getUserRedirects(id: string): Promise<UserRedirectsResponse> {
    const user = await this.userService.getUserById(id);
    return user.redirect_links;
  }
}
