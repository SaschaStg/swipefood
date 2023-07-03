import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsBoolean()
  vegan: boolean;

  @IsBoolean()
  vegetarian: boolean;

  @IsBoolean()
  glutenFree: boolean;

  @IsBoolean()
  dairyFree: boolean;
}
