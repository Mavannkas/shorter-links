import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateNewRedirectLinkDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  customID?: string;

  @IsUrl()
  source: string;
}
