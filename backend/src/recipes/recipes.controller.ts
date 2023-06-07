import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  NotImplementedException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SpoonacularService } from './spoonacular.service';
import { map } from 'rxjs';
import { RecipeDto, SwipeDto } from './dto';
import { RecipesService } from './recipes.service';
import { Request } from 'express';
import { User } from '../users/user.entity';

@ApiTags('recipes')
@ApiBearerAuth()
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly spoonacularService: SpoonacularService,
    private readonly recipeService: RecipesService,
  ) {}

  @Get(':id')
  async getRecipeById(@Param('id') taggedId: string) {
    const [collection, id] = taggedId.split('-');
    switch (collection) {
      case 'sw':
        // get SwipefoodRecipe
        return new NotImplementedException(
          'Custom recipes are not implemented yet',
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
        return new BadRequestException('Invalid recipe id');
    }
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
