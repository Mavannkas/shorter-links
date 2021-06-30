import {
  ImATeapotException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserNotLoginGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (user) {
      throw new ImATeapotException('Redirect');
    }
    return null;
  }
}
