import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  NewUserResponse,
  RecoveryPasswordResponse,
  ResendResponse,
  TokenResponse,
  UserActiveResponse,
  VerifyResponse,
} from 'src/interfaces/auth';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { hashPassword, hashRandom } from 'src/utils/hash';
import { AuthLoginDto } from './dto/auth.login.dto';
import { registerUserDto } from './dto/register-user.dto';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt.strategy';
import { Token } from './entity/token.entity';
import { StatsService } from 'src/stats/stats.service';
import { RolesService } from 'src/roles/roles.service';
import { UserRole } from 'src/interfaces/role';
import { Stats } from 'fs';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
    @Inject(forwardRef(() => StatsService))
    private statsService: StatsService,
    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,
  ) {}

  async registerUser(registerData: registerUserDto): Promise<NewUserResponse> {
    try {
      await this.userService.checkIfUserExists(registerData);

      const user = new User();

      const role = await this.rolesService.getRoleByName(UserRole.User);
      console.log(role);
      user.email = registerData.email;
      user.name = registerData.name;
      user.password_hash = hashPassword(registerData.password);
      user.activation_hash = hashRandom();

      await this.sendMail(
        user,
        `http://shorten.miensny.ct8.pl/main/auth/verify/${user.activation_hash}`,
      );

      await user.save();

      const tempUser = await this.userService.getUserById(user.user_id);
      tempUser.roles.push(role);

      await tempUser.save();

      return this.prepareUserResponse(user);
    } catch (err) {
      throw new ForbiddenException(err.message ?? 'Registration failed');
    }
  }

  async sendMail({ email, name }, url: string, template = 'activation') {
    await this.mailService.sendMail(
      email,
      {
        name,
        url,
      },
      template,
    );
  }

  prepareUserResponse({ user_id, name, email, created_at }): NewUserResponse {
    return {
      user_id,
      name,
      email,
      created_at,
    };
  }

  prepareUserActiveResponse({ name }): UserActiveResponse {
    return {
      name,
    };
  }

  async verifyEmail(hash: string): Promise<VerifyResponse> {
    const user = await User.findOne({
      activation_hash: hash,
      activated: false,
    });

    if (!user) {
      throw new ForbiddenException('Activation failed');
    }

    user.activated = true;

    await user.save();

    return {
      ok: 'Activation success',
    };
  }

  async resendEmail({ email }): Promise<ResendResponse> {
    const user = await User.findOne({ email });

    if (user) {
      user.activation_hash = hashRandom();

      await this.sendMail(
        user,
        `http://shorten.miensny.ct8.pl/main/auth/verify/${user.activation_hash}`,
      );

      await user.save();
    }

    return {
      message: 'Email with activation link has resend successful',
    };
  }

  async login(loginData: AuthLoginDto, res: Response, req): Promise<any> {
    try {
      const user = await this.getAndValidUser(
        loginData.email,
        loginData.password,
      );

      if (!user) {
        throw { message: 'Invalid login data!' };
      }

      const token = await this.createToken(await this.generateToken(user, req));

      return res
        .cookie('jwt', token.accessToken, {
          secure: false,
          domain: 'shorten.miensny.ct8.pl',
          httpOnly: true,
        })
        .redirect('/main/user');
    } catch (error) {
      return res.status(403).render('pages/log-in', {
        error: error.message,
        body: {
          email: loginData.email,
        },
      });
    }
  }

  async getAndValidUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    return await User.findOne({
      email,
      password_hash: hashPassword(password),
      activated: true,
    });
  }

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 30 * 24 * 60 * 60;
    const accessToken = sign(
      payload,
      'ildsafafafafafafafafafuvcbaweiucldscahnucraeosyfusbdfylkeabcnxfwacifwxif7ctawlxufwabtcnixfnybawlcfnwfxgiyerfguisdgfaiusdgfasidyfgiuaeghfiuiuawegifkjhcvjhcvbvhdscyhsdyucvweuydautdasxazinmzjmAKOZMazmLAZMASJKCNHSIDCBASHKDCBHBhcbshkcbsdckjsdnbc',
      { expiresIn },
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: User, req): Promise<string> {
    let token;
    let userWithThisToken = null;

    do {
      token = uuid();
      userWithThisToken = await Token.findOne({ token });
    } while (!!userWithThisToken);

    const clientData = this.statsService.getClientDataFromReq(req);
    const userToken = new Token();

    userToken.token = token;
    userToken.agent = clientData.agent;
    userToken.ip = clientData.ip;
    userToken.referrer = clientData.referrer;
    userToken.user_id = user;
    await userToken.save();

    return token;
  }

  async logout(TokenObj: Token, res: Response) {
    try {
      await TokenObj.remove();
      res.clearCookie('jwt', {
        secure: false,
        domain: 'shorten.miensny.ct8.pl',
        httpOnly: true,
      });

      return res.render('pages/log-in', { ok: 'Successfully logged out' });
    } catch (error) {
      return res.status(403).json({
        statusCode: 403,
        message: error.message,
        error: 'Forbidden',
      });
    }
  }

  async recoveryPassword({ email }): Promise<ResendResponse> {
    const user = await User.findOne({ email });

    if (user) {
      user.change_password_hash = hashRandom();

      await this.sendMail(
        user,
        `http://shorten.miensny.ct8.pl/main/auth/change-password/${user.change_password_hash}`,
        'change-password',
      );

      await user.save();
    }

    return {
      message: `Email with change password link has send on <strong>${email}</strong>`,
    };
  }

  async changePassword(
    hash: string,
    password: RecoveryPasswordDto,
  ): Promise<RecoveryPasswordResponse> {
    this.userService.tryIsPasswordIsValid(
      password.password,
      password.password_repeat,
    );

    const user = await User.findOne(
      {
        change_password_hash: hash,
      },
      {
        relations: ['tokens'],
      },
    );

    if (!user) {
      throw new ForbiddenException('Change password failed, hash not exists');
    }

    user.change_password_hash = null;
    user.password_hash = hashPassword(password.password);

    await user.save();

    await this.userService.clear(user.tokens);

    return {
      ok: '1',
    };
  }
}
