import { Body, Controller, Get, Post } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('main/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async test() {}
}
