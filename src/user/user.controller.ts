import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('main/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
