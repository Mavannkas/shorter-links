import { IsEmail, Length, Matches, MaxLength } from 'class-validator';

export class ResendEmailDto {
  @IsEmail()
  email: string;
}
