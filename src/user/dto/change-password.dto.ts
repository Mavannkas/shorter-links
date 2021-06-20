import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  old_password: string;

  @IsString()
  old_password_repeat: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,25}$/, {
    message:
      'New password does not meet the requirements. 8 - 25 chars, 1 digit, 1 uppercase.',
  })
  new_password: string;
}
