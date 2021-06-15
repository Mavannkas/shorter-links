import {
  ForbiddenException,
  Get,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from './entity/user.entity';

@Injectable()
export class UserService {
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
}
