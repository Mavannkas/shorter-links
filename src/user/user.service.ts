import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/entity/token.entity';
import { TokenResponse } from 'src/interfaces/auth';
import { UserRole } from 'src/interfaces/role';
import {
  DeleteSessionResponse,
  DeleteUserResponse,
  PasswordChangeResponse,
  RolesResponse,
} from 'src/interfaces/user';
import { hashPassword } from 'src/utils/hash';
import { IsNull, Not } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SessionNameDto } from './dto/session-name.dto';

import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async checkIfUserExists({ email, name }) {
    if (
      await User.findOne({
        where: [
          {
            name,
          },
          {
            email,
          },
        ],
      })
    ) {
      throw new ForbiddenException('This name or email is not available');
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await User.find({
      name: Not(IsNull()),
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await User.findOne(id, {
      relations: ['roles', 'tokens', 'redirect_links'],
    });

    if (!user) {
      throw new NotFoundException('This user not exists');
    }

    return user;
  }

  async getSessions(user: User, token: Token): Promise<TokenResponse[]> {
    const res = (await this.getUserById(user.user_id)).tokens.map(
      this.adminService.prepareTokenResponse,
    );
    return res.map((item: TokenResponse) => {
      item.active = item.token_id === token.token_id;
      return item;
    });
  }

  async deleteUser(user: User, res): Promise<DeleteUserResponse> {
    try {
      const { tokens, roles } = await this.getUserById(user.user_id);
      await this.clear(tokens);
      await this.clear(roles);

      user.email = null;
      user.name = null;
      user.password_hash = null;
      user.activation_hash = null;

      await user.save();

      return res
        .clearCookie('jwt', {
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        })
        .json({
          ok: '1',
        });
    } catch (error) {
      return res.status(403).json({
        statusCode: 403,
        message: error.message,
        error: 'Forbidden',
      });
    }
  }

  async clear(object: Array<any>) {
    for (const i in object) {
      await object[i].remove();
    }
  }

  async deleteSession(id: string, user: User): Promise<DeleteSessionResponse> {
    const token = await this.getUserToken(user.user_id, id);
    await token.remove();
    return {
      ok: '1',
    };
  }

  async getRoles({ user_id }): Promise<RolesResponse[]> {
    const user = await this.getUserById(user_id);
    return user.roles.map(({ name }) => ({
      name,
    }));
  }

  async changePass(
    mainUser: User,
    password: ChangePasswordDto,
    token: Token,
  ): Promise<PasswordChangeResponse> {
    this.tryIsPasswordIsValid(
      password.old_password,
      password.old_password_repeat,
    );

    const user = await this.authService.getAndValidUser(
      mainUser.email,
      password.old_password,
    );

    if (!user) {
      throw new BadRequestException('Bad password');
    }

    user.password_hash = hashPassword(password.new_password);

    await user.save();

    await this.clearOtherSessions(mainUser, token);

    return {
      ok: '1',
    };
  }

  tryIsPasswordIsValid(old_password, old_password_repeat): void {
    if (old_password !== old_password_repeat) {
      throw new BadRequestException('Passwords is not equal');
    }
  }

  async clearOtherSessions({ user_id }, token: Token): Promise<void> {
    const user = await this.getUserById(user_id);
    const tokens = user.tokens.filter(
      (item: Token) => !this.isEqual(item.token_id, token.token_id),
    );

    await this.clear(tokens);
  }

  isEqual(a, b) {
    return a === b;
  }

  async addSessionName(
    id: string,
    user: User,
    name: SessionNameDto,
  ): Promise<TokenResponse> {
    const token = await this.getUserToken(user.user_id, id);

    token.name = name.name;

    await token.save();

    return this.adminService.prepareTokenResponse(token);
  }

  async getUserToken(user_id, id): Promise<Token> {
    const user = await this.getUserById(user_id);
    const token = user.tokens.find((item: Token) =>
      this.isEqual(item.token_id, id),
    );

    if (!token) {
      throw new NotFoundException('This sessions not exists');
    }
    return token;
  }
}
