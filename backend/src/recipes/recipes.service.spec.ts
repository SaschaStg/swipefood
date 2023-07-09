import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Swipe } from './swipe.entity';
import { SwipefoodRecipe } from './recipe.entity';
import { SwipefoodIngredient } from './ingredient.entity';
import { UsersService } from '../users/users.service';
import { ImagesService } from '../images/images.service';
import { SpoonacularService } from './spoonacular.service';
import { FindOneOptions, Repository } from 'typeorm';
import {
  CreateRecipeDto,
  RecipeCategoriesDto,
  UpdateIngredientDto,
  UpdateRecipeDto,
} from './dto';
import { User } from '../users/user.entity';
import { Image } from '../images/image.entity';
import { BadRequestException } from '@nestjs/common';

function getRandomIds(): {
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

function getCreateRecipeDto(imageId?: number): CreateRecipeDto {
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

function getSwipefoodRecipe(
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

describe('RecipesService', () => {
  let user: User;
  let recipeRepo: jest.Mocked<Repository<SwipefoodRecipe>>;
  let ingredientRepo: jest.Mocked<Repository<SwipefoodIngredient>>;
  let imagesService: jest.Mocked<ImagesService>;

  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(SwipefoodRecipe),
          useValue: {
            findOne: jest.fn().mockName('recipesRepo.findOne'),
            remove: jest.fn().mockName('recipesRepo.remove'),
            save: jest.fn().mockName('recipesRepo.save'),
          },
        },
        {
          provide: getRepositoryToken(SwipefoodIngredient),
          useValue: {
            delete: jest.fn().mockName('ingredientsRepo.delete'),
          },
        },
        {
          provide: ImagesService,
          useValue: {
            deleteImage: jest.fn().mockName('imagesService.deleteImage'),
            getImageFromDb: jest.fn().mockName('imagesService.getImageFromDb'),
          },
        },
        {
          // This functionality is not tested. Therefore, the mock value is an empty object.
          provide: SpoonacularService,
          useValue: {},
        },
        {
          // This functionality is not tested. Therefore, the mock value is an empty object.
          provide: UsersService,
          useValue: {},
        },
        {
          // This functionality is not tested. Therefore, the mock value is an empty object.
          provide: getRepositoryToken(Swipe),
          useValue: {},
        },
        // Unit under test
        RecipesService,
      ],
    }).compile();

    user = new User();
    user.id = Math.floor(Math.random() * 100 + 1);
    user.displayName = 'Test User';
    user.dairyFree = false;
    user.glutenFree = false;
    user.vegan = false;
    user.vegetarian = false;

    recipeRepo = module.get<Repository<SwipefoodRecipe>>(
      getRepositoryToken(SwipefoodRecipe),
    ) as jest.Mocked<Repository<SwipefoodRecipe>>;
    ingredientRepo = module.get<Repository<SwipefoodIngredient>>(
      getRepositoryToken(SwipefoodIngredient),
    ) as jest.Mocked<Repository<SwipefoodIngredient>>;
    imagesService = module.get<ImagesService>(
      ImagesService,
    ) as jest.Mocked<ImagesService>;

    // Unit under test
    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // As per grading requirements, only the recipe CRUD operations are tested

  describe('createSwipefoodRecipe()', () => {
    it('should create a recipe', async () => {
      const { recipeId } = getRandomIds();
      const createDto = getCreateRecipeDto();

      recipeRepo.save.mockImplementationOnce(async (recipe) => {
        // Check that the recipe is correctly passed to the repository
        expect(recipe).toBeInstanceOf(SwipefoodRecipe);

        expect(recipe.title).toBe(createDto.title);
        expect(recipe.instructions).toBe(createDto.instructions);
        expect(recipe.summary).toBe(createDto.summary);
        expect(recipe.readyInMinutes).toBe(createDto.readyInMinutes);
        expect(recipe.servings).toBe(createDto.servings);
        expect(recipe.vegetarian).toBe(createDto.categories.vegetarian);
        expect(recipe.vegan).toBe(createDto.categories.vegan);
        expect(recipe.glutenFree).toBe(createDto.categories.glutenFree);
        expect(recipe.dairyFree).toBe(createDto.categories.dairyFree);

        expect(recipe.ingredients).toBeDefined();
        expect(recipe.ingredients).toHaveLength(createDto.ingredients.length);

        for (let i = 0; i < createDto.ingredients.length; i++) {
          const ingredient = recipe.ingredients[i];
          const dtoIngredient = createDto.ingredients[i];

          expect(ingredient).toBeInstanceOf(SwipefoodIngredient);
          expect(ingredient.name).toBe(dtoIngredient.name);
          expect(ingredient.amount).toBe(dtoIngredient.amount);
          expect(ingredient.unit).toBe(dtoIngredient.unit);
        }

        expect(recipe.user).toBeDefined();
        expect(recipe.user.id).toBe(user.id); // Only ID is relevant, as it is needed for the relation

        recipe.id = recipeId;

        return recipe as SwipefoodRecipe;
      });

      const returnedRecipe = await service.createSwipefoodRecipe(
        createDto,
        user,
      );

      // Check that the recipe is saved
      expect(recipeRepo.save).toHaveBeenCalled();

      // Check that the recipe is returned unchanged
      expect(returnedRecipe).toBeInstanceOf(SwipefoodRecipe);
      expect(returnedRecipe.id).toBe(recipeId);

      expect(returnedRecipe.title).toBe(createDto.title);
      expect(returnedRecipe.instructions).toBe(createDto.instructions);
      expect(returnedRecipe.summary).toBe(createDto.summary);
      expect(returnedRecipe.readyInMinutes).toBe(createDto.readyInMinutes);
      expect(returnedRecipe.servings).toBe(createDto.servings);
      expect(returnedRecipe.vegetarian).toBe(createDto.categories.vegetarian);
      expect(returnedRecipe.vegan).toBe(createDto.categories.vegan);
      expect(returnedRecipe.glutenFree).toBe(createDto.categories.glutenFree);
      expect(returnedRecipe.dairyFree).toBe(createDto.categories.dairyFree);

      expect(returnedRecipe.ingredients).toBeDefined();
      expect(returnedRecipe.ingredients).toHaveLength(
        createDto.ingredients.length,
      );

      for (let i = 0; i < createDto.ingredients.length; i++) {
        const ingredient = returnedRecipe.ingredients[i];
        const dtoIngredient = createDto.ingredients[i];

        expect(ingredient).toBeInstanceOf(SwipefoodIngredient);
        expect(ingredient.name).toBe(dtoIngredient.name);
        expect(ingredient.amount).toBe(dtoIngredient.amount);
        expect(ingredient.unit).toBe(dtoIngredient.unit);
      }
    });

    it('should create an image', async () => {
      const { recipeId, imageId } = getRandomIds();
      const createDto = getCreateRecipeDto(imageId);

      recipeRepo.save.mockImplementationOnce(async (recipe) => {
        // No need to check the recipe, it's already done in the previous test
        recipe.id = recipeId;
        recipe.imageId = imageId;
        return recipe as SwipefoodRecipe;
      });

      imagesService.getImageFromDb.mockImplementationOnce(async (id, user) => {
        expect(id).toBe(imageId);

        expect(user).toBeDefined();
        expect(user.id).toBe(user.id); // Only ID is relevant for the relation

        const image = new Image();
        image.id = imageId;

        return image;
      });

      const returnedRecipe = await service.createSwipefoodRecipe(
        createDto,
        user,
      );

      // Check that the image is saved
      expect(imagesService.getImageFromDb).toHaveBeenCalled();

      expect(returnedRecipe.imageId).toBe(imageId);
    });

    it('should fail if the image does not exist', async () => {
      const { imageId } = getRandomIds();
      const createDto = getCreateRecipeDto(imageId);

      imagesService.getImageFromDb.mockImplementationOnce(async () => {
        return null;
      });

      await expect(
        service.createSwipefoodRecipe(createDto, user),
      ).rejects.toThrow(BadRequestException);

      expect(imagesService.getImageFromDb).toHaveBeenCalled();
    });
  });

  describe('getSwipefoodRecipeById()', () => {
    it('should return the recipe', async () => {
      const { recipeId } = getRandomIds();

      const recipe = getSwipefoodRecipe(recipeId);

      recipeRepo.findOne.mockImplementationOnce(
        async (options: FindOneOptions<SwipefoodRecipe>) => {
          // Check that the options are correctly passed to the repository
          expect(options.where).toBeDefined();

          expect(options.where['id']).toBe(recipeId);
          expect(options.where['user'].id).toBe(user.id); // Only ID is relevant for the relation

          return recipe;
        },
      );

      const returnedRecipe = await service.getSwipefoodRecipeById(
        recipeId,
        user,
      );

      expect(recipeRepo.findOne).toHaveBeenCalled();

      // Check that the recipe is returned unchanged
      expect(returnedRecipe).toBeInstanceOf(SwipefoodRecipe);
      expect(returnedRecipe.id).toBe(recipeId);
      expect(returnedRecipe.title).toBe(recipe.title);
      expect(returnedRecipe.instructions).toBe(recipe.instructions);
      expect(returnedRecipe.summary).toBe(recipe.summary);
      expect(returnedRecipe.readyInMinutes).toBe(recipe.readyInMinutes);
      expect(returnedRecipe.servings).toBe(recipe.servings);
      expect(returnedRecipe.vegetarian).toBe(recipe.vegetarian);
      expect(returnedRecipe.vegan).toBe(recipe.vegan);
      expect(returnedRecipe.glutenFree).toBe(recipe.glutenFree);
      expect(returnedRecipe.dairyFree).toBe(recipe.dairyFree);

      expect(returnedRecipe.ingredients).toBeDefined();
      expect(returnedRecipe.ingredients).toHaveLength(
        recipe.ingredients.length,
      );

      for (let i = 0; i < recipe.ingredients.length; i++) {
        const returnedIngredient = returnedRecipe.ingredients[i];
        const ingredient = recipe.ingredients[i];

        expect(returnedIngredient).toBeInstanceOf(SwipefoodIngredient);
        expect(returnedIngredient.name).toBe(ingredient.name);
        expect(returnedIngredient.amount).toBe(ingredient.amount);
        expect(returnedIngredient.unit).toBe(ingredient.unit);
      }
    });

    it('should return null if the repository returns null', async () => {
      const { recipeId } = getRandomIds();

      recipeRepo.findOne.mockImplementationOnce(async () => {
        return null;
      });

      const returnedRecipe = await service.getSwipefoodRecipeById(
        recipeId,
        user,
      );

      expect(recipeRepo.findOne).toHaveBeenCalled();

      expect(returnedRecipe).toBeNull();
    });
  });

  describe('updateRecipe()', () => {
    it('should update the recipe', async () => {
      const { recipeId, ingredientIds } = getRandomIds();
      const recipe = getSwipefoodRecipe(recipeId, { ingredientIds });
      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId}`;
      updateDto.title = 'New title';
      updateDto.instructions = 'New instructions';
      updateDto.summary = 'New summary';
      updateDto.readyInMinutes = 9001;
      updateDto.servings = 42;

      updateDto.categories = new RecipeCategoriesDto();
      updateDto.categories.vegetarian = false;
      updateDto.categories.vegan = true;
      updateDto.categories.glutenFree = true;
      updateDto.categories.dairyFree = false;

      updateDto.ingredients = recipe.ingredients.map((ingredient) => {
        const updateIngredient = new UpdateIngredientDto();
        updateIngredient.id = `sw-${ingredient.id}`;
        updateIngredient.name = ingredient.name;
        updateIngredient.amount = ingredient.amount;
        updateIngredient.unit = ingredient.unit;
        return updateIngredient;
      });

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(
        async (parsedRecipeId, owningUser) => {
          // Check if the ID is correctly parsed
          expect(parsedRecipeId).toBe(recipeId);
          expect(owningUser.id).toBe(user.id);

          return recipe;
        },
      );

      recipeRepo.save.mockImplementationOnce(async (recipe) => {
        expect(recipe).toBeInstanceOf(SwipefoodRecipe);
        expect(recipe.id).toBe(recipeId);

        expect(recipe.title).toBe(updateDto.title);
        expect(recipe.instructions).toBe(updateDto.instructions);
        expect(recipe.summary).toBe(updateDto.summary);
        expect(recipe.readyInMinutes).toBe(updateDto.readyInMinutes);
        expect(recipe.servings).toBe(updateDto.servings);
        expect(recipe.vegetarian).toBe(updateDto.categories.vegetarian);
        expect(recipe.vegan).toBe(updateDto.categories.vegan);
        expect(recipe.glutenFree).toBe(updateDto.categories.glutenFree);
        expect(recipe.dairyFree).toBe(updateDto.categories.dairyFree);

        expect(recipe.ingredients).toBeDefined();
        expect(recipe.ingredients).toHaveLength(updateDto.ingredients.length);

        for (let i = 0; i < updateDto.ingredients.length; i++) {
          const ingredient = recipe.ingredients[i];
          const updateIngredient = updateDto.ingredients[i];

          expect(ingredient).toBeInstanceOf(SwipefoodIngredient);
          expect(ingredient.id).toBe(ingredientIds[i]);
          expect(ingredient.name).toBe(updateIngredient.name);
          expect(ingredient.amount).toBe(updateIngredient.amount);
          expect(ingredient.unit).toBe(updateIngredient.unit);
        }

        return recipe as SwipefoodRecipe;
      });

      const returnedRecipe = await service.updateRecipe(updateDto, user);

      expect(service.getSwipefoodRecipeById).toHaveBeenCalled();
      expect(recipeRepo.save).toHaveBeenCalled();

      // Check that the recipe is returned unchanged
      expect(returnedRecipe).toBeInstanceOf(SwipefoodRecipe);
      expect(returnedRecipe.id).toBe(recipeId);
      expect(returnedRecipe.title).toBe(updateDto.title);
      expect(returnedRecipe.instructions).toBe(updateDto.instructions);
      expect(returnedRecipe.summary).toBe(updateDto.summary);
      expect(returnedRecipe.readyInMinutes).toBe(updateDto.readyInMinutes);
      expect(returnedRecipe.servings).toBe(updateDto.servings);
      expect(returnedRecipe.vegetarian).toBe(updateDto.categories.vegetarian);
      expect(returnedRecipe.vegan).toBe(updateDto.categories.vegan);
      expect(returnedRecipe.glutenFree).toBe(updateDto.categories.glutenFree);
      expect(returnedRecipe.dairyFree).toBe(updateDto.categories.dairyFree);

      expect(returnedRecipe.ingredients).toBeDefined();
      expect(returnedRecipe.ingredients).toHaveLength(
        updateDto.ingredients.length,
      );

      for (let i = 0; i < updateDto.ingredients.length; i++) {
        const ingredient = returnedRecipe.ingredients[i];
        const dtoIngredient = updateDto.ingredients[i];

        expect(ingredient).toBeInstanceOf(SwipefoodIngredient);
        expect(ingredient.name).toBe(dtoIngredient.name);
        expect(ingredient.amount).toBe(dtoIngredient.amount);
        expect(ingredient.unit).toBe(dtoIngredient.unit);
      }
    });

    it('should only update changed properties', async () => {
      const { recipeId, ingredientIds } = getRandomIds();

      const recipe = getSwipefoodRecipe(recipeId, { ingredientIds });

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId}`;
      updateDto.title = 'New title'; // Only test title, assume if it works for one it works for all

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(
        async (parsedRecipeId, owningUser) => {
          // Check if the ID is correctly parsed
          expect(parsedRecipeId).toBe(recipeId);
          expect(owningUser.id).toBe(user.id);

          return recipe;
        },
      );

      recipeRepo.save.mockImplementationOnce(async (recipeToSave) => {
        expect(recipeToSave).toBeInstanceOf(SwipefoodRecipe);
        expect(recipeToSave.id).toBe(recipeId);

        // Check that the title is updated
        expect(recipeToSave.title).toBe(updateDto.title);

        // Check that the other properties are unchanged
        expect(recipeToSave.instructions).toBe(recipe.instructions);
        expect(recipeToSave.summary).toBe(recipe.summary);
        expect(recipeToSave.readyInMinutes).toBe(recipe.readyInMinutes);
        expect(recipeToSave.servings).toBe(recipe.servings);
        expect(recipeToSave.vegetarian).toBe(recipe.vegetarian);
        expect(recipeToSave.vegan).toBe(recipe.vegan);
        expect(recipeToSave.glutenFree).toBe(recipe.glutenFree);
        expect(recipeToSave.dairyFree).toBe(recipe.dairyFree);

        expect(recipeToSave.ingredients).toBeDefined();
        expect(recipeToSave.ingredients).toHaveLength(
          recipe.ingredients.length,
        );

        for (let i = 0; i < recipe.ingredients.length; i++) {
          const ingredient = recipeToSave.ingredients[i];
          const originalIngredient = recipe.ingredients[i];

          expect(ingredient).toBeInstanceOf(SwipefoodIngredient);
          expect(ingredient.id).toBe(ingredientIds[i]);
          expect(ingredient.name).toBe(originalIngredient.name);
          expect(ingredient.amount).toBe(originalIngredient.amount);
          expect(ingredient.unit).toBe(originalIngredient.unit);
        }

        return recipeToSave as SwipefoodRecipe;
      });

      const returnedRecipe = await service.updateRecipe(updateDto, user);

      expect(service.getSwipefoodRecipeById).toHaveBeenCalled();
      expect(recipeRepo.save).toHaveBeenCalled();

      // Check that the recipe is returned unchanged
      expect(returnedRecipe).toBeInstanceOf(SwipefoodRecipe);
      expect(returnedRecipe.id).toBe(recipeId);
      expect(returnedRecipe.title).toBe(updateDto.title);
      expect(returnedRecipe.instructions).toBe(recipe.instructions);
      expect(returnedRecipe.summary).toBe(recipe.summary);
      expect(returnedRecipe.readyInMinutes).toBe(recipe.readyInMinutes);
      expect(returnedRecipe.servings).toBe(recipe.servings);
      expect(returnedRecipe.vegetarian).toBe(recipe.vegetarian);
      expect(returnedRecipe.vegan).toBe(recipe.vegan);
      expect(returnedRecipe.glutenFree).toBe(recipe.glutenFree);
      expect(returnedRecipe.dairyFree).toBe(recipe.dairyFree);

      expect(returnedRecipe.ingredients).toBeDefined();
      expect(returnedRecipe.ingredients).toHaveLength(
        recipe.ingredients.length,
      );

      for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = returnedRecipe.ingredients[i];
        const originalIngredient = recipe.ingredients[i];

        expect(ingredient).toBeInstanceOf(SwipefoodIngredient);
        expect(ingredient.name).toBe(originalIngredient.name);
        expect(ingredient.amount).toBe(originalIngredient.amount);
        expect(ingredient.unit).toBe(originalIngredient.unit);
      }
    });

    it('should update ingredients correctly', async () => {
      const { recipeId, ingredientIds } = getRandomIds();
      const newIngredientId = ingredientIds[1] + 1; // Make sure the ID is unique

      const recipe = getSwipefoodRecipe(recipeId, { ingredientIds });

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId}`;

      updateDto.ingredients = [];

      // Update the first ingredient
      const updatedIngredient = new UpdateIngredientDto();
      updatedIngredient.id = `sw-${recipe.ingredients[0].id}`;
      updatedIngredient.name = 'New name';
      updatedIngredient.amount = 123;
      updatedIngredient.unit = 'New unit';
      updateDto.ingredients.push(updatedIngredient);

      // Delete the second ingredient by omitting it from the update DTO

      // Add a new ingredient
      const newIngredient = new UpdateIngredientDto();
      // No ID, since it is a new ingredient
      newIngredient.name = 'Cherries';
      newIngredient.amount = 500;
      newIngredient.unit = 'g';
      updateDto.ingredients.push(newIngredient);

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(
        async (parsedRecipeId, owningUser) => {
          // Check if the ID is correctly parsed
          expect(parsedRecipeId).toBe(recipeId);
          expect(owningUser.id).toBe(user.id);

          return recipe;
        },
      );

      recipeRepo.save.mockImplementationOnce(async (recipeToSave) => {
        expect(recipeToSave).toBeInstanceOf(SwipefoodRecipe);
        expect(recipeToSave.id).toBe(recipeId);

        // Check that the ingredients are updated correctly
        expect(recipeToSave.ingredients).toBeDefined();
        expect(recipeToSave.ingredients).toHaveLength(
          updateDto.ingredients.length,
        );

        // Check that the first ingredient is updated correctly
        const firstIngredient = recipeToSave.ingredients[0];
        expect(firstIngredient).toBeInstanceOf(SwipefoodIngredient);
        expect(firstIngredient.id).toBe(ingredientIds[0]);
        expect(firstIngredient.name).toBe(updatedIngredient.name);
        expect(firstIngredient.amount).toBe(updatedIngredient.amount);
        expect(firstIngredient.unit).toBe(updatedIngredient.unit);

        // Check that the new ingredient is added correctly
        const newlyAddedIngredient = recipeToSave.ingredients[1];
        expect(newlyAddedIngredient).toBeInstanceOf(SwipefoodIngredient);
        expect(newlyAddedIngredient.id).toBeUndefined();
        expect(newlyAddedIngredient.name).toBe(newIngredient.name);
        expect(newlyAddedIngredient.amount).toBe(newIngredient.amount);
        expect(newlyAddedIngredient.unit).toBe(newIngredient.unit);

        // Set the ID of the new ingredient just like the DB would
        newlyAddedIngredient.id = newIngredientId;

        return recipeToSave as SwipefoodRecipe;
      });

      ingredientRepo.delete.mockImplementationOnce(async (criteria) => {
        expect(criteria).toBeDefined();
        expect(criteria).toHaveProperty('id');
        expect(criteria['id']).toBe(ingredientIds[1]);

        return { affected: 1, raw: undefined }; // This value is not used in calling code, but TypeScript needs a value to be returned
      });

      const returnedRecipe = await service.updateRecipe(updateDto, user);

      expect(service.getSwipefoodRecipeById).toHaveBeenCalled();
      expect(recipeRepo.save).toHaveBeenCalled();
      expect(ingredientRepo.delete).toHaveBeenCalledTimes(1);

      // Check that the ingredients are returned correctly
      expect(returnedRecipe).toBeInstanceOf(SwipefoodRecipe);

      expect(returnedRecipe.ingredients).toBeDefined();
      expect(returnedRecipe.ingredients).toHaveLength(
        updateDto.ingredients.length,
      );

      const ingredient0 = returnedRecipe.ingredients[0];
      expect(ingredient0).toBeInstanceOf(SwipefoodIngredient);
      expect(ingredient0.id).toBe(ingredientIds[0]);
      expect(ingredient0.name).toBe(updatedIngredient.name);
      expect(ingredient0.amount).toBe(updatedIngredient.amount);
      expect(ingredient0.unit).toBe(updatedIngredient.unit);

      const ingredient1 = returnedRecipe.ingredients[1];
      expect(ingredient1).toBeInstanceOf(SwipefoodIngredient);
      expect(ingredient1.id).toBe(newIngredientId);
      expect(ingredient1.name).toBe(newIngredient.name);
      expect(ingredient1.amount).toBe(newIngredient.amount);
      expect(ingredient1.unit).toBe(newIngredient.unit);
    });

    it('should fail if the recipe does not exist', async () => {
      const { recipeId } = getRandomIds();

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId}`;
      updateDto.title =
        'I wanna have this new title for this non-existing recipe';

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(
        async (parsedRecipeId, owningUser) => {
          expect(parsedRecipeId).toBe(recipeId);
          expect(owningUser.id).toBe(user.id);

          // Simulate that the recipe does not exist or the user does not have access to it
          return null;
        },
      );

      await expect(service.updateRecipe(updateDto, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update the image', async () => {
      // This property is tested individually,
      // because its update process is different and more complex from the other properties

      const { recipeId, imageId, ingredientIds } = getRandomIds();
      const recipe = getSwipefoodRecipe(recipeId, { ingredientIds });

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId}`;

      updateDto.imageId = imageId;

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(
        async (parsedRecipeId, owningUser) => {
          // Check if the ID is correctly parsed
          expect(parsedRecipeId).toBe(recipeId);
          expect(owningUser.id).toBe(user.id);

          return recipe;
        },
      );

      imagesService.getImageFromDb.mockImplementationOnce(
        async (requestedImageId, owningUser) => {
          expect(requestedImageId).toBe(imageId);
          expect(owningUser.id).toBe(user.id);

          const img = new Image();
          img.id = imageId;
          return img;
        },
      );

      recipeRepo.save.mockImplementationOnce(async (recipeToSave) => {
        expect(recipeToSave).toBeInstanceOf(SwipefoodRecipe);
        expect(recipeToSave.id).toBe(recipeId);

        // Check that the image is updated correctly
        expect(recipeToSave.image).toBeInstanceOf(Image);
        expect(recipeToSave.image.id).toBe(imageId);

        recipeToSave.imageId = recipeToSave.image.id; // Set the imageId just like the DB would

        return recipeToSave as SwipefoodRecipe;
      });

      const returnedRecipe = await service.updateRecipe(updateDto, user);

      expect(service.getSwipefoodRecipeById).toHaveBeenCalled();
      expect(imagesService.getImageFromDb).toHaveBeenCalled();
      expect(recipeRepo.save).toHaveBeenCalled();

      // Check that the image id is saved correctly
      expect(returnedRecipe).toBeInstanceOf(SwipefoodRecipe);

      expect(returnedRecipe.imageId).toBe(imageId);
    });

    it('should not update the image', async () => {
      // This property is tested individually,
      // because its update process is different and more complex from the other properties

      const { recipeId, imageId } = getRandomIds();
      const recipe = getSwipefoodRecipe(recipeId, { imageId });

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId}`;

      // Leave the imageId undefined to simulate that the image is not updated

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(
        async (parsedRecipeId, owningUser) => {
          // Check if the ID is correctly parsed
          expect(parsedRecipeId).toBe(recipeId);
          expect(owningUser.id).toBe(user.id);

          return recipe;
        },
      );

      recipeRepo.save.mockImplementationOnce(async (recipeToSave) => {
        expect(recipeToSave).toBeInstanceOf(SwipefoodRecipe);
        expect(recipeToSave.id).toBe(recipeId);

        // Check that the image is not updated
        expect(recipeToSave.image).toBeUndefined();
        expect(recipeToSave.imageId).toBe(imageId);

        return recipeToSave as SwipefoodRecipe;
      });

      const returnedRecipe = await service.updateRecipe(updateDto, user);

      expect(service.getSwipefoodRecipeById).toHaveBeenCalled();
      expect(recipeRepo.save).toHaveBeenCalled();

      // Check that the image id is not updated
      expect(returnedRecipe).toBeInstanceOf(SwipefoodRecipe);

      expect(returnedRecipe.imageId).toBe(imageId);
    });

    it('should fail if the image does not exist', async () => {
      // This property is tested individually,
      // because its update process is different and more complex from the other properties

      const { recipeId, imageId } = getRandomIds();
      const recipe = getSwipefoodRecipe(recipeId);

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId}`;

      updateDto.imageId = imageId;

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(
        async (parsedRecipeId, owningUser) => {
          // Check if the ID is correctly parsed
          expect(parsedRecipeId).toBe(recipeId);
          expect(owningUser.id).toBe(user.id);

          return recipe;
        },
      );

      imagesService.getImageFromDb.mockImplementationOnce(
        async (requestedImageId, owningUser) => {
          expect(requestedImageId).toBe(imageId);
          expect(owningUser.id).toBe(user.id);

          return null; // Simulate that the image does not exist
        },
      );

      await expect(service.updateRecipe(updateDto, user)).rejects.toThrow(
        BadRequestException,
      );

      expect(service.getSwipefoodRecipeById).toHaveBeenCalled();
      expect(imagesService.getImageFromDb).toHaveBeenCalled();
      expect(recipeRepo.save).not.toHaveBeenCalled();
    });

    it('should delete the image', async () => {
      const { recipeId, imageId } = getRandomIds();
      const recipe = getSwipefoodRecipe(recipeId, { imageId });

      const updateDto = new UpdateRecipeDto();
      updateDto.id = `sw-${recipeId}`;

      updateDto.imageId = null; // Set the imageId to null to simulate that the image is deleted

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(
        async (parsedRecipeId, owningUser: User) => {
          // Check if the ID is correctly parsed
          expect(parsedRecipeId).toBe(recipeId);
          expect(owningUser.id).toBe(user.id);

          return recipe;
        },
      );

      recipeRepo.save.mockImplementationOnce(async (recipeToSave) => {
        expect(recipeToSave).toBeInstanceOf(SwipefoodRecipe);
        expect(recipeToSave.id).toBe(recipeId);

        // Check that the image is deleted
        expect(recipeToSave.image).toBeNull();

        recipeToSave.imageId = null; // Set the imageId just like the DB would

        return recipeToSave as SwipefoodRecipe;
      });

      imagesService.deleteImage.mockImplementationOnce(
        async (imageIdToDelete: number, owningUser: User) => {
          expect(imageIdToDelete).toBe(imageId);
          expect(owningUser.id).toBe(user.id);
        },
      );

      const returnedRecipe = await service.updateRecipe(updateDto, user);

      expect(service.getSwipefoodRecipeById).toHaveBeenCalled();
      expect(recipeRepo.save).toHaveBeenCalled();
      expect(imagesService.deleteImage).toHaveBeenCalled();

      // Check that the image id is deleted
      expect(returnedRecipe).toBeInstanceOf(SwipefoodRecipe);

      expect(returnedRecipe.imageId).toBeNull();
    });
  });

  describe('deleteRecipe()', () => {
    it('should delete the recipe', async () => {
      const { recipeId } = getRandomIds();
      const recipe = getSwipefoodRecipe(recipeId);

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(async (id, owningUser) => {
        expect(id).toBe(recipeId);
        expect(owningUser.id).toBe(user.id);

        return recipe;
      });

      recipeRepo.remove.mockImplementationOnce(async (recipe) => {
        expect(recipe).toBeInstanceOf(SwipefoodRecipe);
        expect(recipe.id).toBe(recipeId);
        // Only need to check ID, since the ORM will only care about the ID when deleting

        return recipe; // TypeORM's remove() function returns the removed entity
      });

      await service.deleteRecipe(recipeId, user);

      // The recipe has no image, so it should not try to delete one.
      expect(imagesService.deleteImage).not.toHaveBeenCalled();

      expect(recipeRepo.remove).toHaveBeenCalled();
    });

    it('should delete the image', async () => {
      const { recipeId, imageId } = getRandomIds();
      const recipe = getSwipefoodRecipe(recipeId, { imageId });

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(
        async (requestedRecipeId, owningUser) => {
          expect(requestedRecipeId).toBe(recipeId);
          expect(owningUser.id).toBe(user.id);

          return recipe;
        },
      );

      imagesService.deleteImage.mockImplementationOnce(
        async (id, owningUser) => {
          expect(id).toBe(imageId);

          expect(owningUser).toBeDefined();
          expect(owningUser.id).toBe(user.id); // Only ID is relevant for the relation
        },
      );
      recipeRepo.remove.mockResolvedValue(recipe);

      await service.deleteRecipe(recipeId, user);

      expect(imagesService.deleteImage).toHaveBeenCalled();
      expect(recipeRepo.remove).toHaveBeenCalled();
    });

    it('should fail if the recipe does not exist', async () => {
      const recipeId = Math.floor(Math.random() * 100 + 1);

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn().mockResolvedValue(null);

      await expect(service.deleteRecipe(recipeId, user)).rejects.toThrow(
        BadRequestException,
      );

      expect(imagesService.deleteImage).not.toHaveBeenCalled();
      expect(recipeRepo.remove).not.toHaveBeenCalled();
    });
  });
});
