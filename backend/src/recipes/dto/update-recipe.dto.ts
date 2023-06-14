import { UpdateIngredientDto } from './update-ingredient.dto';

export class UpdateRecipeDto {
  id: string;
  title?: string;
  readyInMinutes?: number;
  servings?: number;
  image?: string;
  summary?: string;
  instructions?: string;
  categories?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  };
  ingredients?: UpdateIngredientDto[];
}
