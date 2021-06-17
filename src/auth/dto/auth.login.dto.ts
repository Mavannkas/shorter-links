import { IsEmail, IsString, Matches } from 'class-validator';
export class AuthLoginDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
