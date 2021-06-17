import {
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
import { DeleteUserResponse } from 'src/interfaces/user';

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
    return await User.find();
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

  async getSessions(user: User): Promise<TokenResponse[]> {
    const res = (await this.getUserById(user.user_id)).tokens.map(
      this.adminService.prepareTokenResponse,
    );
    return res;
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
}
