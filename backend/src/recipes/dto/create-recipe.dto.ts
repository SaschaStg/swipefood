import { CreateIngredientDto } from './create-ingredient.dto';

export class CreateRecipeDto {
  title: string;
  readyInMinutes: number;
  servings: number;

  // TODO
  //image: string;

  summary: string;
  instructions: string;
  categories: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  ingredients: CreateIngredientDto[];
}
