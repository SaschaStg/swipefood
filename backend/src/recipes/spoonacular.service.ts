import { Injectable } from '@nestjs/common';
import { SpoonacularRecipe } from './spoonacular';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { readFileSync } from 'fs';

@Injectable()
export class SpoonacularService {
  private readonly spoonacularApiEndpoint = 'https://api.spoonacular.com';

  private readonly requestConfig: AxiosRequestConfig;

  private readonly recipeIdCache: Map<number, boolean> = new Map();

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    let apiKey = configService.get<string>('SPOONACULAR_API_KEY');
    if (!apiKey) {
      apiKey = readFileSync(
        configService.getOrThrow<string>('SPOONACULAR_API_KEY_FILE'),
        'utf-8',
      );
    }

    this.requestConfig = {
      headers: {
        'x-api-key': apiKey,
      },
    };
  }

  getSpoonacularRecipeById(id: number): Observable<SpoonacularRecipe> {
    return this.httpService
      .get<SpoonacularRecipe>(
        `${this.spoonacularApiEndpoint}/recipes/${id}/information`,
        this.requestConfig,
      )
      .pipe(
        map((response) => response.data),
        tap((recipe) => this.recipeIdCache.set(recipe.id, true)),
      );
  }

  async validateRecipeId(id: number) {
    if (this.recipeIdCache.has(id)) {
      return this.recipeIdCache.get(id);
    }
    const recipe = await firstValueFrom(this.getSpoonacularRecipeById(id));
    return recipe !== undefined;
  }
}
