import { CreateIngredientDto } from './create-ingredient.dto';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RecipeCategoriesDto } from './recipe-categories.dto';
import { Type } from 'class-transformer';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsPositive()
  readyInMinutes: number;

  @IsInt()
  @IsPositive()
  servings: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  imageId?: number;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ValidateNested()
  @Type(() => RecipeCategoriesDto)
  categories: RecipeCategoriesDto;

  @ValidateNested({ each: true })
  @Type(() => CreateIngredientDto)
  ingredients: CreateIngredientDto[];
}
