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
import { CreateRecipeDto } from './dto';
import { User } from '../users/user.entity';
import { Image } from '../images/image.entity';
import { BadRequestException } from '@nestjs/common';

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
  imageId?: number,
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
  chocolate.name = 'Milk Chocolate';
  chocolate.amount = 1;
  chocolate.unit = 'Bar';

  const banana = new SwipefoodIngredient();
  banana.name = 'Banana';
  banana.amount = 1;
  banana.unit = '';

  recipe.ingredients = [chocolate, banana];

  recipe.imageId = imageId;

  return recipe;
}

describe('RecipesService', () => {
  let user: User;
  let recipeRepo: jest.Mocked<Repository<SwipefoodRecipe>>;
  let imagesService: jest.Mocked<ImagesService>;

  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // This functionality is not tested. Therefore, the mock value is an empty object.
          provide: getRepositoryToken(Swipe),
          useValue: {},
        },
        {
          provide: getRepositoryToken(SwipefoodRecipe),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SwipefoodIngredient),
          useValue: {},
        },
        {
          provide: SpoonacularService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: ImagesService,
          useValue: {
            deleteImage: jest.fn(),
            getImageFromDb: jest.fn(),
          },
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
      const recipeId = Math.floor(Math.random() * 100 + 1);
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
      const recipeId = Math.floor(Math.random() * 100 + 1);
      const imageId = Math.floor(Math.random() * 100 + 1);
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
      const imageId = Math.floor(Math.random() * 100 + 1);
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
      const recipeId = Math.floor(Math.random() * 100 + 1);

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
      const recipeId = Math.floor(Math.random() * 100 + 1);

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
    // TODO
  });

  describe('deleteRecipe()', () => {
    it('should delete the recipe', async () => {
      const recipeId = Math.floor(Math.random() * 100 + 1);
      const recipe = getSwipefoodRecipe(recipeId);

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(async () => {
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
      const recipeId = Math.floor(Math.random() * 100 + 1);
      const imageId = Math.floor(Math.random() * 100 + 1);
      const recipe = getSwipefoodRecipe(recipeId, imageId);

      // Mock the internal function for this test as it is tested elsewhere
      service.getSwipefoodRecipeById = jest.fn(async () => {
        return recipe;
      });

      imagesService.deleteImage.mockImplementationOnce(async (id, user) => {
        expect(id).toBe(imageId);

        expect(user).toBeDefined();
        expect(user.id).toBe(user.id); // Only ID is relevant for the relation
      });
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
