import { UpdateIngredientDto } from './update-ingredient.dto';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateRecipeCategoriesDto } from './update-recipe-categories.dto';
import { Type } from 'class-transformer';

export class UpdateRecipeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readyInMinutes?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  servings?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  image?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  summary?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  instructions?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRecipeCategoriesDto)
  categories?: UpdateRecipeCategoriesDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateIngredientDto)
  ingredients?: UpdateIngredientDto[];
}
