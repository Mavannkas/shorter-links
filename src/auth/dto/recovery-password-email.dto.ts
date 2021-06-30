import { IsEmail, Length, Matches, MaxLength } from 'class-validator';

export class RecoveryPasswordEmailDto {
  @IsEmail()
  email: string;
}
