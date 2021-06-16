import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  NewUserResponse,
  ResendResponse,
  VerifyResponse,
} from 'src/interfaces/auth';
import { AuthService } from './auth.service';
import { registerUserDto } from './dto/register-user.dto';
import { Response } from 'express';
import { AuthLoginDto } from './dto/auth.login.dto';

import { MyAuthGuard } from 'src/guards/my-auth.guard';
import { TokenObj } from 'src/decorators/token-obj.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Token } from './entity/token.entity';

@Controller('main/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerData: registerUserDto): Promise<NewUserResponse> {
    return this.authService.registerUser(registerData);
  }

  @Get('login')
  // @UseGuards(AuthGuard('jwt'))
  login() {
    return 'Login site';
  }

  @Post('login')
  @UseGuards(new MyAuthGuard())
  loginUser(
    @Body() loginData: AuthLoginDto,
    @Res() res: Response,
    @Req() req,
    @TokenObj() tokenObj,
  ): Promise<any> {
    return this.authService.login(loginData, res, req, tokenObj);
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@TokenObj() tokenObj: Token, @Res() res: Response) {
    return this.authService.logout(tokenObj, res);
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
