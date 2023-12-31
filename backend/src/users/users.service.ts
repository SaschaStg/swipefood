import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserUpdateDto } from './dto';
import { SwipefoodRecipe } from '../recipes/recipe.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  create(userAttrs: Omit<User, 'id' | 'recipes'>): Promise<User> {
    const user = new User();
    user.displayName = userAttrs.displayName;
    user.vegan = userAttrs.vegan;
    user.vegetarian = userAttrs.vegetarian;
    user.glutenFree = userAttrs.glutenFree;
    user.dairyFree = userAttrs.dairyFree;
    return this.usersRepo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepo.findOneBy({ id });
  }

  async update(id: number, userUpdate: UserUpdateDto) {
    const result = await this.usersRepo.update({ id }, userUpdate);

    if (result.affected === 0) {
      throw new BadRequestException('User not found');
    }

    return this.findOne(id);
  }

  async getCustomRecipes(user: User): Promise<SwipefoodRecipe[]> {
    user = await this.usersRepo.findOne({
      where: { id: user.id },
      relations: {
        recipes: true,
      },
    });
    return user.recipes;
  }
}
