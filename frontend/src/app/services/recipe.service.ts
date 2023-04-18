import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {Recipe} from "../models/recipe";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  data = {
    "offset": 0,
    "number": 2,
    "results": [
      {
        "id": 716429,
        "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
        "image": "https://spoonacular.com/recipeImages/716429-312x231.jpg",
        "imageType": "jpg"
      },
      {
        "id": 715538,
        "title": "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        "image": "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        "imageType": "jpg"
      }
    ],
    "totalResults": 86,
    "_link": "//GET https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2"
  }

  getRecipeData(): Observable<Recipe> {
    return of({name:this.data.results[0].title, image:this.data.results[0].image, id:this.data.results[0].id, imageType:this.data.results[0].imageType});
  }


}
