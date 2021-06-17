import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class UpdateRedirectLinkDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  customID?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  source?: string;
}
