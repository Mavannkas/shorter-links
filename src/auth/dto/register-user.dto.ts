import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export class registerUserDto {
  @Length(6, 25)
  name: string;
  @IsEmail()
  email: string;
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,25}$/, {
    message:
      'Password does not meet the requirements. 8 - 25 chars, 1 digit, 1 uppercase.',
  })
  password: string;

  @IsString()
  password_repeat: string;
}
