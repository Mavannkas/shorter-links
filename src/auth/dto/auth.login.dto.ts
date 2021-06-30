import { IsEmail, IsString, Matches } from 'class-validator';
export class AuthLoginDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
