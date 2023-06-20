import {Injectable} from '@angular/core';
import {catchError, Observable} from "rxjs";
import {Recipe} from "../models/recipe";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private httpClient: HttpClient) {
  }

  getRecipeById(recipeId: string): Observable<Recipe> {
    return this.httpClient.get<Recipe>(`api/recipes/${recipeId}`);
  }

  getLikedRecipes(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(`api/recipes/liked`);
  }
  patchRecipeWithId(recipe: Recipe): Observable<Recipe>{
    return this.httpClient.post<Recipe>(`api/recipes/{recipeId}`, recipe)
  }

  postRecipe(recipe: Recipe): Observable<Recipe>{
      return this.httpClient.post<Recipe>(`api/recipes`, recipe)
  }

  addRecipeToUser(recipeId: string, isLiked: boolean): Observable<Recipe> {
    const body = {isLiked: isLiked};
    return this.httpClient.post<Recipe>(`api/recipes/${recipeId}/swipe`, body);
  }

  getCustomUserRecipes(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(`api/users/me/recipes`);
  }

  getRandomRecipe(): Observable<Recipe> {
    return this.httpClient.get<Recipe>(`api/recipes/random`);
  }



}
