import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DietUpdateDto, UserUpdateDto } from './dto';
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

  /**
   * @deprecated
   * @param dietUpdate
   * @param req
   */
  @Patch('me/diet')
  @ApiOperation({ deprecated: true })
  async updateDiet(
    @Body() dietUpdate: DietUpdateDto,
    @Request() req,
  ): Promise<User> {
    return this.usersService.updateDiet(req.user.id, dietUpdate);
  }
}
