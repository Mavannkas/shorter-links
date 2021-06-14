import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  NewUserResponse,
  ResendResponse,
  UserActiveResponse,
  VerifyResponse,
} from 'src/interfaces/auth';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { hashPassword, hashRandom } from 'src/utils/hash';
import { registerUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}

  async registerUser(registerData: registerUserDto): Promise<NewUserResponse> {
    try {
      await this.userService.checkIfUserExists(registerData);

      const user = new User();
      user.email = registerData.email;
      user.name = registerData.name;
      user.password_hash = hashPassword(registerData.password);
      user.activation_hash = hashRandom();

      await this.sendActivationEmail(user);

      await user.save();

      return this.prepareUserResponse(user);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async sendActivationEmail({ email, name, activation_hash }) {
    await this.mailService.sendActivationMail(email, {
      name,
      url: `http://localhost:3000/main/auth/verify/${activation_hash}`,
    });
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
      user: this.prepareUserActiveResponse(user),
      message: 'Activation success',
    };
  }

  async resendEmail(email: string): Promise<ResendResponse> {
    const user = await User.findOne({ email });

    if (user) {
      user.activation_hash = hashRandom();

      await this.sendActivationEmail(user);

      await user.save();
    }

    return {
      message: 'Email with activation link has resend successful',
    };
  }
}
