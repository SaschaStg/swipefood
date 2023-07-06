import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Recipe} from "../models/recipe";
import {HttpClient, HttpEvent} from "@angular/common/http";

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
    return this.httpClient.patch<Recipe>(`api/recipes/${recipe.id}`, recipe);
  }

  postRecipe(recipe: Recipe): Observable<Recipe>{
      return this.httpClient.post<Recipe>(`api/recipes`, recipe);
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


  postCustomRecipeImage(formData: any){
    return this.httpClient.post<{id: string}>(`api/images`, formData);

  }

  putCustomRecipeImage(formData:any, imageId: string){
    return this.httpClient.put(`api/images/${imageId}`, formData);
  }


  // um zu überschreiben




}
