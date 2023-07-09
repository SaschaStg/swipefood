import { CreateRecipeDto } from './dto';
import { SwipefoodRecipe } from './recipe.entity';
import { SwipefoodIngredient } from './ingredient.entity';

export function getRandomIds(): {
  recipeId: number;
  imageId: number;
  ingredientIds: number[];
} {
  const ingredientIds = [];
  ingredientIds.push(Math.floor(Math.random() * 100 + 1));
  ingredientIds.push(ingredientIds[0] + 1); // Make sure the IDs are different

  return {
    recipeId: Math.floor(Math.random() * 100 + 1),
    imageId: Math.floor(Math.random() * 100 + 1),
    ingredientIds,
  };
}

export function getCreateRecipeDto(imageId?: number): CreateRecipeDto {
  const createDto = new CreateRecipeDto();
  createDto.title = 'A megapint of hot chocolate';
  createDto.instructions =
    'Melt chocolate, pour into a glass, add milk, stir, enjoy!';
  createDto.summary = 'A very large amount of hot chocolate';
  createDto.readyInMinutes = 10;
  createDto.servings = 1;
  createDto.categories = {
    vegetarian: true,
    vegan: false,
    glutenFree: true, // Milk chocolate is gluten-free
    dairyFree: false,
  };
  createDto.ingredients = [
    {
      name: 'Milk Chocolate',
      amount: 1,
      unit: 'kg',
    },
    {
      name: 'Milk',
      amount: 1,
      unit: 'l',
    },
  ];
  createDto.imageId = imageId;

  return createDto;
}

export function getSwipefoodRecipe(
  recipeId: number,
  options?: {
    imageId?: number;
    ingredientIds?: number[];
  },
): SwipefoodRecipe {
  const recipe = new SwipefoodRecipe();
  recipe.id = recipeId;
  recipe.title = "Poor man's Banana Split";
  recipe.summary = 'A banana with chocolate';
  recipe.instructions =
    'Peel banana and cut into slices, cut chocolate into bite-sized chunks, put banana and chocolate in a bowl, enjoy!';
  recipe.readyInMinutes = 2;
  recipe.servings = 1;
  recipe.vegetarian = true;
  recipe.vegan = false;
  recipe.glutenFree = true;
  recipe.dairyFree = false;

  const chocolate = new SwipefoodIngredient();
  chocolate.id =
    options?.ingredientIds?.at(0) ?? Math.floor(Math.random() * 100 + 1);
  chocolate.name = 'Milk Chocolate';
  chocolate.amount = 1;
  chocolate.unit = 'Bar';

  const banana = new SwipefoodIngredient();
  banana.id =
    options?.ingredientIds?.at(1) ?? Math.floor(Math.random() * 100 + 1);
  banana.name = 'Banana';
  banana.amount = 1;
  banana.unit = '';

  recipe.ingredients = [chocolate, banana];

  recipe.imageId = options?.imageId;

  return recipe;
}
