import {
  Controller,
  Get,
  NotImplementedException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpoonacularService } from './spoonacular.service';
import { map } from 'rxjs';
import { RecipeDto } from './dto';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly spoonacularService: SpoonacularService) {}

  @Get(':id')
  async getRecipeById(@Param('id') taggedId: string) {
    const [collection, id] = taggedId.split('-');
    switch (collection) {
      case 'sw':
        // get SwipefoodRecipe
        return new NotImplementedException();
      case 'sp':
        // get SpoonacularRecipe
        return this.spoonacularService
          .getSpoonacularRecipeById(+id)
          .pipe(
            map((spoonacularRecipe) =>
              RecipeDto.fromSpoonacularRecipe(spoonacularRecipe),
            ),
          );
    }
  }
}
