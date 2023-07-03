import { IsBoolean } from 'class-validator';

export class RecipeCategoriesDto {
  @IsBoolean()
  vegetarian: boolean;

  @IsBoolean()
  vegan: boolean;

  @IsBoolean()
  glutenFree: boolean;

  @IsBoolean()
  dairyFree: boolean;
}
