import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { SpoonacularService } from './spoonacular.service';
import { RecipesService } from './recipes.service';
import { UsersService } from '../users/users.service';
import {
  getCreateRecipeDto,
  getRandomIds,
  getSwipefoodRecipe,
} from './test-utils';
import { User } from '../users/user.entity';
import { RecipeDto, UpdateRecipeDto } from './dto';
import { SwipefoodRecipe } from './recipe.entity';
import { SwipefoodIngredient } from './ingredient.entity';
import { firstValueFrom } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';

describe('RecipesController', () => {
  let user: User;
  let recipesService: jest.Mocked<RecipesService>;

  // Unit under test
  let controller: RecipesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SpoonacularService,
          useValue: {},
        },
        {
          provide: RecipesService,
          useValue: {
            createSwipefoodRecipe: jest
              .fn()
              .mockName('recipesService.createSwipefoodRecipe'),
            getSwipefoodRecipeById: jest
              .fn()
              .mockName('recipesService.getSwipefoodRecipeById'),
            updateRecipe: jest.fn().mockName('recipesService.updateRecipe'),
            deleteRecipe: jest.fn().mockName('recipesService.deleteRecipe'),
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
      // Unit under test
      controllers: [RecipesController],
    }).compile();

    user = new User();
    user.id = Math.floor(Math.random() * 100 + 1);
    user.displayName = 'Test User';
    user.dairyFree = false;
    user.glutenFree = false;
    user.vegan = false;
    user.vegetarian = false;

    recipesService = module.get<RecipesService>(
      RecipesService,
    ) as jest.Mocked<RecipesService>;

    // Unit under test
    controller = module.get<RecipesController>(RecipesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // As per grading requirements, only the recipe CRUD operations are tested

  describe('createRecipe', () => {
    it('should return a RecipeDto', async () => {
      const { recipeId, ingredientIds } = getRandomIds();

      const createDto = getCreateRecipeDto();

      recipesService.createSwipefoodRecipe.mockImplementationOnce(
        async (recipeToCreate, designatedOwner) => {
          expect(designatedOwner).toBe(user);
          expect(recipeToCreate).toEqual(createDto);

          const recipe = new SwipefoodRecipe();
          recipe.id = recipeId;
          recipe.title = recipeToCreate.title;
          recipe.instructions = recipeToCreate.instructions;
          recipe.summary = recipeToCreate.summary;
          recipe.readyInMinutes = recipeToCreate.readyInMinutes;
          recipe.servings = recipeToCreate.servings;

          recipe.vegan = recipeToCreate.categories.vegan;
          recipe.vegetarian = recipeToCreate.categories.vegetarian;
          recipe.glutenFree = recipeToCreate.categories.glutenFree;
          recipe.dairyFree = recipeToCreate.categories.dairyFree;

          recipe.ingredients = recipeToCreate.ingredients.map(
            (ingredient, i) => {
              const swIngredient = new SwipefoodIngredient();
              swIngredient.id = ingredientIds[i];
              swIngredient.name = ingredient.name;
              swIngredient.amount = ingredient.amount;
              swIngredient.unit = ingredient.unit;
              return swIngredient;
            },
          );

          recipe.imageId = recipeToCreate.imageId;

          // Return a copy of the recipe
          return instanceToInstance(recipe);
        },
      );

      const returnedDto = await controller.createRecipe(createDto, user);

      expect(returnedDto).toBeInstanceOf(RecipeDto);

      expect(returnedDto.id).toBe(`sw-${recipeId}`);
      expect(returnedDto.title).toBe(createDto.title);
      expect(returnedDto.instructions).toBe(createDto.instructions);
      expect(returnedDto.summary).toBe(createDto.summary);
      expect(returnedDto.readyInMinutes).toBe(createDto.readyInMinutes);
      expect(returnedDto.servings).toBe(createDto.servings);

      expect(returnedDto.categories.vegan).toBe(createDto.categories.vegan);
      expect(returnedDto.categories.vegetarian).toBe(
        createDto.categories.vegetarian,
      );
      expect(returnedDto.categories.glutenFree).toBe(
        createDto.categories.glutenFree,
      );
      expect(returnedDto.categories.dairyFree).toBe(
        createDto.categories.dairyFree,
      );

      // Check ingredients
      expect(returnedDto.ingredients).toHaveLength(
        createDto.ingredients.length,
      );
      for (let i = 0; i < returnedDto.ingredients.length; i++) {
        const returnedIngredient = returnedDto.ingredients[i];
        const ingredient = createDto.ingredients[i];

        expect(returnedIngredient.id).toBe(`sw-${ingredientIds[i]}`);
        expect(returnedIngredient.name).toBe(ingredient.name);
        expect(returnedIngredient.amount).toBe(ingredient.amount);
        expect(returnedIngredient.unit).toBe(ingredient.unit);
      }
    });
  });

  describe('getRecipeById', () => {
    // As per grading requirements, only the custom recipe GET operation is tested
    it('should return a RecipeDto', async () => {
      const { recipeId, ingredientIds } = getRandomIds();

      const recipe = getSwipefoodRecipe(recipeId, { ingredientIds });

      recipesService.getSwipefoodRecipeById.mockImplementationOnce(
        async (parsedId, owningUser) => {
          expect(parsedId).toBe(recipeId);
          expect(owningUser).toBe(user);

          // Return a copy of the recipe
          return instanceToInstance(recipe);
        },
      );

      const returnedDto = await firstValueFrom(
        controller.getRecipeById(`sw-${recipeId}`, user),
      );

      expect(returnedDto).toBeInstanceOf(RecipeDto);

      expect(returnedDto.id).toBe(`sw-${recipeId}`);
      expect(returnedDto.title).toBe(recipe.title);
      expect(returnedDto.instructions).toBe(recipe.instructions);
      expect(returnedDto.summary).toBe(recipe.summary);
      expect(returnedDto.readyInMinutes).toBe(recipe.readyInMinutes);
      expect(returnedDto.servings).toBe(recipe.servings);

      expect(returnedDto.categories.vegan).toBe(recipe.vegan);
      expect(returnedDto.categories.vegetarian).toBe(recipe.vegetarian);
      expect(returnedDto.categories.glutenFree).toBe(recipe.glutenFree);
      expect(returnedDto.categories.dairyFree).toBe(recipe.dairyFree);

      // Check ingredients
      expect(returnedDto.ingredients).toHaveLength(recipe.ingredients.length);
      for (let i = 0; i < returnedDto.ingredients.length; i++) {
        const returnedIngredient = returnedDto.ingredients[i];
        const ingredient = recipe.ingredients[i];

        expect(returnedIngredient.id).toBe(`sw-${ingredientIds[i]}`);
        expect(returnedIngredient.name).toBe(ingredient.name);
        expect(returnedIngredient.amount).toBe(ingredient.amount);
        expect(returnedIngredient.unit).toBe(ingredient.unit);
      }

      expect(recipesService.getSwipefoodRecipeById).toHaveBeenCalled();
    });

    it('should throw if the recipe does not exist', async () => {
      const { recipeId } = getRandomIds();

      recipesService.getSwipefoodRecipeById.mockImplementationOnce(
        async (parsedId, owningUser) => {
          expect(parsedId).toBe(recipeId);
          expect(owningUser).toBe(user);

          return null; // Return null to simulate not finding the recipe
        },
      );

      await expect(
        firstValueFrom(controller.getRecipeById(`sw-${recipeId}`, user)),
      ).rejects.toThrow(NotFoundException);

      expect(recipesService.getSwipefoodRecipeById).toHaveBeenCalled();
    });

    it('should throw if the id is invalid', async () => {
      expect(() => {
        controller.getRecipeById('invalid-id', user);
      }).toThrow(BadRequestException);

      // Check with a valid prefix but invalid id
      expect(() => {
        controller.getRecipeById('sw-invalid-id', user);
      }).toThrow(BadRequestException);

      expect(() => {
        controller.getRecipeById('sp-invalid-id', user);
      }).toThrow(BadRequestException);

      expect(recipesService.getSwipefoodRecipeById).not.toHaveBeenCalled();
    });
  });

  describe('updateRecipe', () => {
    it('should update the recipe', async () => {
      const { recipeId, ingredientIds } = getRandomIds();

      const recipe = getSwipefoodRecipe(recipeId, { ingredientIds });

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId}`;

      updateDto.title = 'Updated title';

      recipesService.updateRecipe.mockImplementationOnce(
        async (recipeToUpdate, owningUser) => {
          expect(recipeToUpdate).toBeInstanceOf(UpdateRecipeDto);
          expect(recipeToUpdate).toEqual(updateDto);

          expect(owningUser.id).toBe(user.id);

          const clonedRecipe = instanceToInstance(recipe);
          clonedRecipe.title = updateDto.title;

          return clonedRecipe;
        },
      );

      const returnedDto = await controller.updateRecipe(
        `sw-${recipeId}`,
        updateDto,
        user,
      );

      // Check that the returned dto is correct
      expect(returnedDto).toBeInstanceOf(RecipeDto);
      expect(returnedDto.id).toBe(`sw-${recipeId}`);
      expect(returnedDto.title).toBe(updateDto.title);
      expect(returnedDto.instructions).toBe(recipe.instructions);
      expect(returnedDto.summary).toBe(recipe.summary);
      expect(returnedDto.readyInMinutes).toBe(recipe.readyInMinutes);
      expect(returnedDto.servings).toBe(recipe.servings);

      expect(returnedDto.categories.vegan).toBe(recipe.vegan);
      expect(returnedDto.categories.vegetarian).toBe(recipe.vegetarian);
      expect(returnedDto.categories.glutenFree).toBe(recipe.glutenFree);
      expect(returnedDto.categories.dairyFree).toBe(recipe.dairyFree);

      // Check ingredients
      expect(returnedDto.ingredients).toHaveLength(recipe.ingredients.length);
      for (let i = 0; i < returnedDto.ingredients.length; i++) {
        const returnedIngredient = returnedDto.ingredients[i];
        const ingredient = recipe.ingredients[i];

        expect(returnedIngredient.id).toBe(`sw-${ingredientIds[i]}`);
        expect(returnedIngredient.name).toBe(ingredient.name);
        expect(returnedIngredient.amount).toBe(ingredient.amount);
        expect(returnedIngredient.unit).toBe(ingredient.unit);
      }
    });

    it('should throw if id changed', async () => {
      const { recipeId } = getRandomIds();

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId + 1}`;

      await expect(
        controller.updateRecipe(`sw-${recipeId}`, updateDto, user),
      ).rejects.toThrow(BadRequestException);

      expect(recipesService.updateRecipe).not.toHaveBeenCalled();
    });

    it('should throw if trying to update a spoonacular recipe', async () => {
      const { recipeId } = getRandomIds();

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sp-${recipeId}`;

      await expect(
        controller.updateRecipe(`sp-${recipeId}`, updateDto, user),
      ).rejects.toThrow(BadRequestException);

      expect(recipesService.updateRecipe).not.toHaveBeenCalled();
    });

    it('should throw if id is invalid', async () => {
      const updateDto = new UpdateRecipeDto();
      updateDto.id = 'invalid-id';

      await expect(
        controller.updateRecipe('invalid-id', updateDto, user),
      ).rejects.toThrow(BadRequestException);

      // Check with a valid prefix but invalid id
      updateDto.id = 'sw-invalid-id';

      await expect(
        controller.updateRecipe('sw-invalid-id', updateDto, user),
      ).rejects.toThrow(BadRequestException);

      expect(recipesService.updateRecipe).not.toHaveBeenCalled();
    });
  });

  describe('deleteRecipe', () => {
    it('should delete the recipe', async () => {
      const { recipeId } = getRandomIds();

      recipesService.deleteRecipe.mockImplementationOnce(
        async (parsedId, owningUser) => {
          expect(parsedId).toBe(recipeId);
          expect(owningUser).toBe(user);
        },
      );

      await controller.deleteRecipe(`sw-${recipeId}`, user);

      expect(recipesService.deleteRecipe).toHaveBeenCalled();
    });

    it('should throw if trying to delete a spoonacular recipe', async () => {
      const { recipeId } = getRandomIds();

      await expect(
        controller.deleteRecipe(`sp-${recipeId}`, user),
      ).rejects.toThrow(BadRequestException);

      expect(recipesService.deleteRecipe).not.toHaveBeenCalled();
    });

    it('should throw if the id is invalid', async () => {
      await expect(controller.deleteRecipe('invalid-id', user)).rejects.toThrow(
        BadRequestException,
      );

      // Check with a valid prefix but invalid id
      await expect(
        controller.deleteRecipe('sw-invalid-id', user),
      ).rejects.toThrow(BadRequestException);

      expect(recipesService.deleteRecipe).not.toHaveBeenCalled();
    });
  });
});
