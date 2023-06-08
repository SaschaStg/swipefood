import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Swipe } from './swipe.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SpoonacularService } from './spoonacular.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Swipe)
    private swipeRepo: Repository<Swipe>,
    private userService: UsersService,
    private spoonacularService: SpoonacularService,
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

  async isRecipeIdValid(taggedId: string): Promise<boolean> {
    const [collection, id] = taggedId.split('-');
    switch (collection) {
      case 'sw':
        // SwipefoodRecipe
        // TODO: SW Recipes are not implemented yet
        return false;
      case 'sp':
        // SpoonacularRecipe
        return this.spoonacularService.validateRecipeId(+id);
      default:
        return false;
    }
  }
}
