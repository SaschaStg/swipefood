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
import { map, tap } from 'rxjs';
import { CreateRecipeDto, RecipeDto, SwipeDto, UpdateRecipeDto } from './dto';
import { RecipesService } from './recipes.service';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { ReqUser } from '../auth/user.decorator';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@ApiTags('recipes')
@ApiBearerAuth()
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly spoonacularService: SpoonacularService,
    private readonly recipeService: RecipesService,
  ) {}

  @Get('random')
  async getRandomRecipe() {
    return this.spoonacularService
      .getRandomSpoonacularRecipe()
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
