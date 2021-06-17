import { IsString } from 'class-validator';

export class AddRoleDto {
  @IsString()
  name: string;
}
