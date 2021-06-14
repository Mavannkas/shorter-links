import { ForbiddenException, Get, Injectable } from '@nestjs/common';

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
}
