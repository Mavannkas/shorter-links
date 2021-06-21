import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class SessionNameDto {
  @IsString()
  name: string;
}
