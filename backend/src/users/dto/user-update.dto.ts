import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly displayName?: string;

  @IsOptional()
  @IsBoolean()
  readonly vegetarian?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly vegan?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly glutenFree?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly dairyFree?: boolean;
}
