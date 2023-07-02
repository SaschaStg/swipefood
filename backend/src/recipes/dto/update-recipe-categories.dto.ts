import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRecipeCategoriesDto {
  @IsOptional()
  @IsBoolean()
  vegetarian?: boolean;

  @IsOptional()
  @IsBoolean()
  vegan?: boolean;

  @IsOptional()
  @IsBoolean()
  glutenFree?: boolean;

  @IsOptional()
  @IsBoolean()
  dairyFree?: boolean;
}
