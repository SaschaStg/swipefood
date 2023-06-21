import { IngredientDto } from './ingredient.dto';
import { SpoonacularRecipe } from '../spoonacular';
import { SwipefoodRecipe } from '../recipe.entity';

export class RecipeDto {
  id: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  image: string;
  summary: string;
  instructions: string;
  categories: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  ingredients: IngredientDto[];

  constructor(
    id: string,
    title: string,
    readyInMinutes: number,
    servings: number,
    image: string,
    summary: string,
    instructions: string,
    categories: {
      vegetarian: boolean;
      vegan: boolean;
      glutenFree: boolean;
      dairyFree: boolean;
    },
    ingredients: IngredientDto[],
  ) {
    this.id = id;
    this.title = title;
    this.readyInMinutes = readyInMinutes;
    this.servings = servings;
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
      'api/images/generic',
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
