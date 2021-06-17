import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from 'src/user/entity/user.entity';
import { Token } from './entity/token.entity';
export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: any): null | string {
  return req?.cookies ? req?.cookies?.jwt ?? null : null;
}

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey:
        'ildsafafafafafafafafafuvcbaweiucldscahnucraeosyfusbdfylkeabcnxfwacifwxif7ctawlxufwabtcnixfnybawlcfnwfxgiyerfguisdgfaiusdgfasidyfgiuaeghfiuiuawegifkjhcvjhcvbvhdscyhsdyucvweuydautdasxazinmzjmAKOZMazmLAZMASJKCNHSIDCBASHKDCBHBhcbshkcbsdckjsdnbc',
    });
  }

  async validate(payload: JwtPayload, done: (err, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }

    const token = await Token.findOne(
      { token: payload.id },
      {
        relations: ['user_id'],
      },
    );

    if (!token) {
      return done(new UnauthorizedException(), false);
    }

    const user = await User.findOne(token.user_id.user_id);
    done(null, { token, user });
  }
}
