import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SpoonacularService } from './spoonacular.service';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { CreateRecipeDto, RecipeDto, SwipeDto, UpdateRecipeDto } from './dto';
import { RecipesService } from './recipes.service';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { ReqUser } from '../auth/user.decorator';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { UsersService } from '../users/users.service';

@ApiTags('recipes')
@ApiBearerAuth()
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly spoonacularService: SpoonacularService,
    private readonly recipeService: RecipesService,
    private readonly userService: UsersService,
  ) {}

  @Get('random')
  async getRandomRecipe(@ReqUser() user: User) {
    // Enrich user with data from the database
    user = await this.userService.findOne(user.id);

    return this.spoonacularService
      .getRandomSpoonacularRecipe({
        vegan: user.vegan,
        vegetarian: user.vegetarian,
        glutenFree: user.glutenFree,
        dairyFree: user.dairyFree,
      })
      .pipe(
        map((spoonacularRecipe) =>
          RecipeDto.fromSpoonacularRecipe(spoonacularRecipe),
        ),
      );
  }

  @Post()
  async createRecipe(@Body() recipe: CreateRecipeDto, @ReqUser() user: User) {
    return RecipeDto.fromSwipefoodRecipe(
      await this.recipeService.createSwipefoodRecipe(recipe, user as User),
    );
  }

  @Get('liked')
  getLikedRecipes(@ReqUser() user: User): Observable<RecipeDto[]> {
    // 1. Get all liked recipe ids (unified) and timestamps from the database
    return fromPromise(this.recipeService.getLikedRecipeIds(user)).pipe(
      // 2. Split the recipe ids and timestamps according to their collection (SWipefood or SPoonacular)
      map((recipes) =>
        recipes.reduce<{
          swRecipes: { id: number; timestamp: Date }[];
          spRecipes: { id: number; timestamp: Date }[];
        }>(
          (acc, recipe) => {
            const [collection, id] = recipe.id.split('-');
            switch (collection) {
              case 'sw':
                acc.swRecipes.push({ id: +id, timestamp: recipe.timestamp });
                return acc;
              case 'sp':
                acc.spRecipes.push({ id: +id, timestamp: recipe.timestamp });
                return acc;
              default:
                // Ignore invalid recipe ids
                return acc;
            }
          },
          { swRecipes: [], spRecipes: [] },
        ),
      ),
      // 3. Get the recipes from the respective services
      switchMap((recipes) => {
        // This code heavily uses forkJoin to resolve nested observables
        return forkJoin({
          swRecipes:
            // If there are no recipes, return an empty array
            recipes.swRecipes.length === 0
              ? of([])
              : forkJoin(
                  // Create an array of observables; one for each recipe
                  recipes.swRecipes.map((recipe) =>
                    fromPromise(
                      this.recipeService.getSwipefoodRecipeById(
                        recipe.id,
                        user,
                      ),
                    ).pipe(
                      // Combine the recipe with its timestamp, transforming it into a RecipeDto while we're at it
                      map((swipefoodRecipe) => ({
                        recipe: RecipeDto.fromSwipefoodRecipe(swipefoodRecipe),
                        timestamp: recipe.timestamp,
                      })),
                    ),
                  ) as Observable<{ recipe: RecipeDto; timestamp: Date }>[],
                ),
          spRecipes:
            // If there are no recipes, return an empty array
            recipes.spRecipes.length === 0
              ? of([])
              : this.spoonacularService
                  // Get the recipes from spoonacular using the bulk endpoint
                  .getSpoonacularRecipesBulk(
                    recipes.spRecipes.map((recipe) => recipe.id),
                  )
                  .pipe(
                    map((spoonacularRecipes) => {
                      // Combine the recipes with their timestamps, transforming them into a RecipeDto while we're at it
                      return spoonacularRecipes.map((spoonacularRecipe, i) => ({
                        // This assumes spoonacular returns the recipes in the same order as requested
                        recipe:
                          RecipeDto.fromSpoonacularRecipe(spoonacularRecipe),
                        timestamp: recipes.spRecipes[i].timestamp,
                      }));
                    }),
                  ),
        });
      }),
      // 4. Finally, combine the recipes from both services and sort them by timestamp
      map((recipes) =>
        recipes.swRecipes
          // Combine the recipes from both services
          .concat(recipes.spRecipes)
          // Sort by timestamp (newest first)
          .sort((a, b) => {
            return b.timestamp.getTime() - a.timestamp.getTime();
          })
          // Remove the timestamp, returning only the recipe
          .map((recipe) => recipe.recipe),
      ),
    );
  }

  @Get(':id')
  getRecipeById(@Param('id') taggedId: string, @ReqUser() user: User) {
    const [collection, id] = taggedId.split('-');
    switch (collection) {
      case 'sw':
        // get SwipefoodRecipe
        return fromPromise(
          this.recipeService.getSwipefoodRecipeById(+id, user),
        ).pipe(
          tap((recipe) => {
            if (!recipe) {
              throw new NotFoundException('Recipe not found');
            }
          }),
          map((swipefoodRecipe) =>
            RecipeDto.fromSwipefoodRecipe(swipefoodRecipe),
          ),
        );
      case 'sp':
        // get SpoonacularRecipe
        return this.spoonacularService
          .getSpoonacularRecipeById(+id)
          .pipe(
            map((spoonacularRecipe) =>
              RecipeDto.fromSpoonacularRecipe(spoonacularRecipe),
            ),
          );
      default:
        throw new BadRequestException('Invalid recipe id');
    }
  }

  @Patch(':id')
  async updateRecipe(
    @Param('id') taggedId: string,
    @Body() recipe: UpdateRecipeDto,
    @ReqUser() user: User,
  ) {
    if (!recipe.id || !recipe.id.startsWith('sw-')) {
      throw new BadRequestException('Invalid recipe id');
    }
    if (recipe.id !== taggedId) {
      throw new BadRequestException('Cannot change recipe id');
    }
    return RecipeDto.fromSwipefoodRecipe(
      await this.recipeService.updateRecipe(recipe, user),
    );
  }

  @Delete(':id')
  async deleteRecipe(@Param('id') taggedId: string, @ReqUser() user: User) {
    if (!taggedId.startsWith('sw-')) {
      throw new BadRequestException('Cannot delete non-custom recipes');
    }
    await this.recipeService.deleteRecipe(taggedId, user);
  }

  @Post(':id/swipe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async swipeRecipe(
    @Param('id') taggedId: string,
    @Body() swipeDto: SwipeDto,
    @Req() req: Request,
  ) {
    if (!(await this.recipeService.isRecipeIdValid(taggedId))) {
      throw new NotFoundException('Recipe not found');
    }
    await this.recipeService.swipeRecipe(
      taggedId,
      swipeDto.isLiked,
      (req.user as User).id,
    );
  }
}
