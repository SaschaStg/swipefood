import { Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users/users.service';
import { RecipesService } from '../recipes/recipes.service';
import { demoSpoonacularRecipes, demoSwipefoodRecipes } from './demo-data';
import { User } from '../users/user.entity';

const randomBytesP = promisify(randomBytes);

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}

  async initializeDemo() {
    // Create demo users
    const users: {
      username: string;
      password: string;
      displayName: string;
      id?: number;
    }[] = [
      {
        username: 'mustermax',
        password: await this.generatePassword(),
        displayName: 'Max Mustermann',
      },
      {
        username: 'jdoe',
        password: await this.generatePassword(),
        displayName: 'Jane Doe',
      },
      {
        username: 'foo',
        password: await this.generatePassword(),
        displayName: 'Foo Bar',
      },
    ];
    this.logger.log(`Creating ${users.length} demo users...`);
    for (const user of users) {
      const createdUser = await this.usersService.create({
        ...user,
        vegan: Math.random() < 0.25,
        vegetarian: Math.random() < 0.25,
        glutenFree: Math.random() < 0.25,
        dairyFree: Math.random() < 0.25,
      });

      user.id = createdUser.id;
    }

    // Create demo swipes
    this.logger.log(`Swiping 10 recipes for each demo user...`);
    for (const user of users) {
      for (let i = 0; i < 10; i++) {
        await this.recipesService.swipeRecipe(
          `sp-${this.getRandomDemoRecipeId()}`,
          Math.random() > 0.5,
          user.id,
        );
      }
    }

    // Create demo recipes
    this.logger.log(`Creating a demo recipe for each demo user...`);
    // From https://www.chefkoch.de/rezepte/2099571338804197/Pasta-mit-saemiger-Hackfleischsauce.html
    await this.recipesService.createSwipefoodRecipe(demoSwipefoodRecipes[0], {
      id: users[0].id,
    } as User);
    await this.recipesService.createSwipefoodRecipe(demoSwipefoodRecipes[1], {
      id: users[1].id,
    } as User);
    await this.recipesService.createSwipefoodRecipe(demoSwipefoodRecipes[2], {
      id: users[2].id,
    } as User);

    return users.map((user) => ({
      username: user.username,
      password: user.password,
      displayName: user.displayName,
    }));
  }

  private async generatePassword(): Promise<string> {
    const bytes = await randomBytesP(16);
    return bytes.toString('base64');
  }

  private getRandomDemoRecipeId(): number {
    return demoSpoonacularRecipes[
      Math.floor(Math.random() * demoSpoonacularRecipes.length)
    ].id;
  }
}
