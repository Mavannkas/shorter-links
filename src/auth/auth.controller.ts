import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  NewUserResponse,
  ResendResponse,
  VerifyResponse,
} from 'src/interfaces/auth';
import { AuthService } from './auth.service';
import { registerUserDto } from './dto/register-user.dto';

@Controller('main/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerData: registerUserDto): Promise<NewUserResponse> {
    return this.authService.registerUser(registerData);
  }

  @Get('verify/:hash')
  verifyEmail(@Param('hash') hash: string): Promise<VerifyResponse> {
    return this.authService.verifyEmail(hash);
  }

  @Get('resend-email/:email')
  resendEmail(@Param('email') email: string): Promise<ResendResponse> {
    return this.authService.resendEmail(email);
  }
}
