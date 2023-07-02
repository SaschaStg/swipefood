import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SpoonacularRecipe } from './spoonacular';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  catchError,
  firstValueFrom,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { AxiosError, AxiosRequestConfig } from 'axios';
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
        catchError((err: AxiosError) => {
          if (err.response?.status === HttpStatus.NOT_FOUND) {
            throw new NotFoundException('Recipe not found');
          } else throw err;
        }),
      );
  }

  async validateRecipeId(id: number) {
    if (this.recipeIdCache.has(id)) {
      return this.recipeIdCache.get(id);
    }
    const recipe = await firstValueFrom(this.getSpoonacularRecipeById(id));
    return recipe !== undefined;
  }

  getRandomSpoonacularRecipe(diet?: {
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
  }): Observable<SpoonacularRecipe> {
    const diets = [];
    const intolerances = [];
    if (diet?.vegan) {
      diets.push('vegan');
    }
    if (diet?.vegetarian) {
      diets.push('vegetarian');
    }
    if (diet?.glutenFree) {
      intolerances.push('gluten');
    }
    if (diet?.dairyFree) {
      intolerances.push('dairy');
    }

    return this.httpService
      .get<{ results: { id: number }[] }>(
        `${this.spoonacularApiEndpoint}/recipes/complexSearch`,
        {
          ...this.requestConfig,
          params: {
            number: 1,
            sort: 'random',
            diet: diets.length > 0 ? diets.join(',') : undefined,
            intolerances:
              intolerances.length > 0 ? intolerances.join(',') : undefined,
          },
        },
      )
      .pipe(
        switchMap((response) => {
          const recipeId = response.data.results[0].id;
          return this.getSpoonacularRecipeById(recipeId);
        }),
      );
  }

  getSpoonacularRecipesBulk(ids: number[]): Observable<SpoonacularRecipe[]> {
    const url = `${this.spoonacularApiEndpoint}/recipes/informationBulk`;
    return this.httpService
      .get<SpoonacularRecipe[]>(url, {
        ...this.requestConfig,
        params: {
          ids: ids.join(','),
        },
      })
      .pipe(map((response) => response.data));
  }
}
