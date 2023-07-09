import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from './dto';
import { User } from './user.entity';
import { ReqUser } from '../auth/user.decorator';
import { RecipeDto } from '../recipes/dto';

@ApiTags('users')
@ApiCookieAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  async updateCurrentUser(
    @Body() userUpdate: UserUpdateDto,
    @ReqUser() user: User,
  ): Promise<User> {
    return this.usersService.update(user.id, userUpdate);
  }

  @Get('me/recipes')
  async getCustomRecipes(
    @Request() req,
    @ReqUser() user: User,
  ): Promise<RecipeDto[]> {
    const recipes = await this.usersService.getCustomRecipes(user);
    return recipes.map((recipe) => RecipeDto.fromSwipefoodRecipe(recipe));
  }
}
