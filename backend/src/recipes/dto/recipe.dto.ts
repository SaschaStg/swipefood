import { IngredientDto } from './ingredient.dto';
import { SpoonacularRecipe } from '../spoonacular';
import { SwipefoodRecipe } from '../recipe.entity';
import { RecipeCategoriesDto } from './recipe-categories.dto';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RecipeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsPositive()
  readyInMinutes: number;

  @IsNumber()
  @IsPositive()
  servings: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  imageId?: number;

  @IsUrl()
  image: string;

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
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  constructor(
    id: string,
    title: string,
    readyInMinutes: number,
    servings: number,
    imageId: number | undefined,
    image: string,
    summary: string,
    instructions: string,
    categories: RecipeCategoriesDto,
    ingredients: IngredientDto[],
  ) {
    this.id = id;
    this.title = title;
    this.readyInMinutes = readyInMinutes;
    this.servings = servings;
    this.imageId = imageId;
    this.image = image;
    this.summary = summary;
    this.instructions = instructions;
    this.categories = categories;
    this.ingredients = ingredients;
  }

  static fromSpoonacularRecipe(recipe: SpoonacularRecipe): RecipeDto {
    return new RecipeDto(
      `sp-${recipe.id}`,
      recipe.title,
      recipe.readyInMinutes,
      recipe.servings,
      undefined,
      recipe.image,
      recipe.summary,
      recipe.instructions,
      {
        dairyFree: recipe.dairyFree,
        glutenFree: recipe.glutenFree,
        vegan: recipe.vegan,
        vegetarian: recipe.vegetarian,
      },
      recipe.extendedIngredients.map((ingredient) =>
        IngredientDto.fromSpoonacularIngredient(ingredient),
      ),
    );
  }

  static fromSwipefoodRecipe(recipe: SwipefoodRecipe): RecipeDto {
    return new RecipeDto(
      `sw-${recipe.id}`,
      recipe.title,
      recipe.readyInMinutes,
      recipe.servings,
      recipe.imageId ?? undefined,
      `api/images/${recipe.imageId ?? 'generic'}`,
      recipe.summary,
      recipe.instructions,
      {
        dairyFree: recipe.dairyFree,
        glutenFree: recipe.glutenFree,
        vegan: recipe.vegan,
        vegetarian: recipe.vegetarian,
      },
      recipe.ingredients.map((ingredient) =>
        IngredientDto.fromSwipefoodIngredient(ingredient),
      ),
    );
  }
}
