import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  NewUserResponse,
  RecoveryPasswordResponse,
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
import { ForbiddenRedirectFilter } from 'src/filters/forbidden-redirect.filter';
import { UserNotLoginGuard } from 'src/guards/user-not-login.guard';
import { CheckEmailPipe } from 'src/pipes/check-email.pipe';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { RecoveryPasswordEmailDto } from './dto/recovery-password-email.dto';
import { PipeResponseFilter } from 'src/filters/pipe-response.filter';

@Controller('main/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register')
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  @UseGuards(new UserNotLoginGuard())
  @Render('pages/register')
  getRegister() {
    return;
  }

  @Post('register')
  @UseFilters(
    new PipeResponseFilter('register'),
    new ForbiddenRedirectFilter('/main/user'),
  )
  @UseGuards(new UserNotLoginGuard())
  @Render('pages/register')
  register(@Body() registerData: registerUserDto): Promise<NewUserResponse> {
    return this.authService.registerUser(registerData);
  }

  @Get('login')
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  @UseGuards(new UserNotLoginGuard())
  @Render('pages/log-in')
  getLogin() {
    return;
  }

  @Post('login')
  @UseFilters(
    new ForbiddenRedirectFilter('/main/user'),
    new PipeResponseFilter('log-in'),
  )
  @UseGuards(new UserNotLoginGuard())
  loginUser(
    @Body() loginData: AuthLoginDto,
    @Res() res: Response,
    @Req() req,
  ): Promise<any> {
    return this.authService.login(loginData, res, req);
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ForbiddenRedirectFilter())
  logout(@TokenObj() tokenObj: Token, @Res() res: Response) {
    return this.authService.logout(tokenObj, res);
  }

  @Get('verify/:hash')
  @UseGuards(new UserNotLoginGuard())
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  verifyEmail(@Param('hash') hash: string): Promise<VerifyResponse> {
    return this.authService.verifyEmail(hash);
  }

  @Get('resend-email')
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  @UseGuards(new UserNotLoginGuard())
  @Render('pages/resend-email')
  getResendEmail() {
    return;
  }

  @Post('resend-email')
  @UseGuards(new UserNotLoginGuard())
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  resendEmail(@Body() email: ResendEmailDto): Promise<ResendResponse> {
    return this.authService.resendEmail(email);
  }

  @Get('recovery-password')
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  @UseGuards(new UserNotLoginGuard())
  @Render('pages/recovery')
  getRecoveryPassword() {
    return;
  }

  @Post('recovery-password')
  @UseGuards(new UserNotLoginGuard())
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  recoveryPassword(
    @Body() email: RecoveryPasswordEmailDto,
  ): Promise<ResendResponse> {
    return this.authService.recoveryPassword(email);
  }

  @Get('change-password/:hash')
  @UseFilters(new ForbiddenRedirectFilter('/main/user'))
  @UseGuards(new UserNotLoginGuard())
  @Render('pages/change-password')
  getChangePassword() {
    return;
  }

  @Post('change-password/:hash')
  @UseGuards(new UserNotLoginGuard())
  changePassword(
    @Param('hash') hash: string,
    @Body() password: RecoveryPasswordDto,
  ): Promise<RecoveryPasswordResponse> {
    return this.authService.changePassword(hash, password);
  }
}
