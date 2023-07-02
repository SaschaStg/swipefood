import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CredentialUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  newUsername?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  newPassword?: string;

  @IsString()
  @IsNotEmpty()
  currentPassword: string;
}
