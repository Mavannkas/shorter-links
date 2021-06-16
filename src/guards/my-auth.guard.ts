import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MyAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    console.log('XD ');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
