import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Swipe } from './swipe.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SpoonacularService } from './spoonacular.service';
import { SwipefoodRecipe } from './recipe.entity';
import { SwipefoodIngredient } from './ingredient.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './dto';
import { User } from '../users/user.entity';
import { assignDefined } from '../util';
import { Image } from '../images/image.entity';
import { ImagesService } from '../images/images.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Swipe)
    private swipeRepo: Repository<Swipe>,
    private userService: UsersService,
    private spoonacularService: SpoonacularService,
    @InjectRepository(SwipefoodRecipe)
    private swRecipeRepo: Repository<SwipefoodRecipe>,
    @InjectRepository(SwipefoodIngredient)
    private swIngredientRepo: Repository<SwipefoodIngredient>,
    private imagesService: ImagesService,
  ) {}

  async swipeRecipe(recipeId: string, isLiked: boolean, userId: number) {
    const swipe = new Swipe();
    swipe.recipeId = recipeId;
    swipe.isLiked = isLiked;
    swipe.timestamp = new Date();
    swipe.user = await this.userService.findOne(userId);

    if (swipe.user === null) {
      throw new BadRequestException('User not found');
    }

    await this.swipeRepo.save(swipe);
  }

  async getLikedRecipeIds(
    user: User,
  ): Promise<{ id: string; timestamp: Date }[]> {
    const likedSwipes = await this.swipeRepo
      .createQueryBuilder('swipe')
      .where('swipe.userId = :userId', { userId: user.id })
      .andWhere('swipe.isLiked = true')
      .getMany();
    return likedSwipes.map((swipe) => ({
      id: swipe.recipeId,
      timestamp: swipe.timestamp,
    }));
  }

  async isRecipeIdValid(taggedId: string): Promise<boolean> {
    const [collection, id] = taggedId.split('-');
    switch (collection) {
      case 'sw':
        // SwipefoodRecipe
        return await this.swRecipeRepo.exist({ where: { id: +id } });
      case 'sp':
        // SpoonacularRecipe
        return this.spoonacularService.validateRecipeId(+id);
      default:
        return false;
    }
  }

  // SwipefoodRecipes CRUD
  async createSwipefoodRecipe(
    recipe: CreateRecipeDto,
    user: User,
  ): Promise<SwipefoodRecipe> {
    const swRecipe = new SwipefoodRecipe();
    swRecipe.title = recipe.title;
    swRecipe.readyInMinutes = recipe.readyInMinutes;
    swRecipe.servings = recipe.servings;
    swRecipe.summary = recipe.summary;
    swRecipe.instructions = recipe.instructions;
    swRecipe.vegetarian = recipe.categories.vegetarian;
    swRecipe.vegan = recipe.categories.vegan;
    swRecipe.glutenFree = recipe.categories.glutenFree;
    swRecipe.dairyFree = recipe.categories.dairyFree;

    if (recipe.imageId) {
      swRecipe.image = await this.getImageOrFail(recipe.imageId, user);
    }

    swRecipe.ingredients = recipe.ingredients.map((ingredient) => {
      const swIngredient = new SwipefoodIngredient();
      swIngredient.name = ingredient.name;
      swIngredient.amount = ingredient.amount;
      swIngredient.unit = ingredient.unit;
      return swIngredient;
    });

    swRecipe.user = user;

    return this.swRecipeRepo.save(swRecipe);
  }

  async getSwipefoodRecipeById(
    id: number,
    user: User,
  ): Promise<SwipefoodRecipe | null> {
    return this.swRecipeRepo.findOne({
      where: {
        id,
        // Return null if the user is not the owner of the recipe;
        // this is to prevent users from accessing other users' recipes.
        // This needs to be changed when we implement sharing recipes
        user: { id: user.id },
      },
    });
  }

  async updateRecipe(recipe: UpdateRecipeDto, user: User) {
    const recipeId = +recipe.id.split('-')[1]; // Remove the 'sw-' prefix

    let dbRecipe = await this.getSwipefoodRecipeById(recipeId, user);
    if (!dbRecipe) {
      throw new BadRequestException('Recipe not found');
    }

    // Only initialize image if the user provided one;
    // this automatically removes the image from the recipe if no image was provided
    let image: Image | undefined;
    let oldImageId: number | undefined;
    if (recipe.imageId && dbRecipe.imageId !== recipe.imageId) {
      // Image was changed
      image = await this.getImageOrFail(recipe.imageId, user);
    } else if (dbRecipe.imageId && recipe.imageId === null) {
      // Schedule deletion of the image if the user removed it
      // Defer actual deletion until the recipe change went through without errors
      oldImageId = dbRecipe.imageId;
      image = null;
    }

    // Update basic recipe info
    const basicUpdate = {
      title: recipe.title,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      summary: recipe.summary,
      instructions: recipe.instructions,
      vegetarian: recipe.categories?.vegetarian,
      vegan: recipe.categories?.vegan,
      glutenFree: recipe.categories?.glutenFree,
      dairyFree: recipe.categories?.dairyFree,
      image: image,
    };
    assignDefined(dbRecipe, basicUpdate);

    // Update ingredients if an ingredient list was provided
    if (recipe.ingredients) {
      let ingredients: Omit<SwipefoodIngredient, 'recipe'>[] =
        recipe.ingredients.map((ingredient) => ({
          id: ingredient.id
            ? +ingredient.id.split('-')[1] // Remove the 'sw-' prefix
            : undefined, // If the ingredient doesn't have an id, it's a new ingredient
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        }));

      for (const ingredient of dbRecipe.ingredients) {
        const updatedIngredient = ingredients.find(
          (i) => i.id === ingredient.id,
        );
        // If the ingredient is not in the updated list, delete it
        if (!updatedIngredient) {
          await this.swIngredientRepo.delete({ id: ingredient.id });
        } else {
          // Otherwise, update it
          assignDefined(ingredient, updatedIngredient);
        }

        // Remove the ingredient from the list of ingredients to process
        ingredients = ingredients.filter((i) => i.id !== ingredient.id);
      }

      // Add the remaining ingredients to the recipe
      for (const ingredient of ingredients) {
        const swIngredient = new SwipefoodIngredient();
        swIngredient.name = ingredient.name;
        swIngredient.amount = ingredient.amount;
        swIngredient.unit = ingredient.unit;
        dbRecipe.ingredients.push(swIngredient);
      }
    }

    dbRecipe = await this.swRecipeRepo.save(dbRecipe);

    if (oldImageId && dbRecipe.imageId === null) {
      // Run deferred image deletion if the image was removed
      await this.imagesService.deleteImage(oldImageId, user);
    }

    return dbRecipe;
  }

  async deleteRecipe(recipeId: number, user: User) {
    const dbRecipe = await this.getSwipefoodRecipeById(recipeId, user);
    if (!dbRecipe) {
      throw new BadRequestException('Recipe not found');
    }

    if (dbRecipe.imageId) {
      await this.imagesService.deleteImage(dbRecipe.imageId, user);
    }

    await this.swRecipeRepo.remove(dbRecipe);
  }

  private async getImageOrFail(id: number, user: User) {
    const image = await this.imagesService.getImageFromDb(id, user);
    if (!image) {
      throw new BadRequestException('Invalid image');
    }
    return image;
  }
}
