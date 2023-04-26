import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {Recipe} from "../models/recipe";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  data: Recipe = {
    "id": "test-1234",
    "title": "Spicy Thai Noodle Soup",
    "readyInMinutes": 30,
    "image": "https://spoonacular.com/recipeImages/660019-556x370.jpg",
    "imageType": "jpg",
    "instructions": "1. In a large pot, heat oil over medium-high heat. Add onion and sauté for 3-4 minutes until softened. \n2. Add garlic, ginger and curry paste and sauté for an additional minute.\n3. Pour in the chicken or vegetable broth and bring to a boil. Add the noodles and cook according to package instructions.\n4. Once noodles are cooked, stir in coconut milk, lime juice, fish sauce, brown sugar and red pepper flakes. \n5. Reduce heat to low and let soup simmer for 10-15 minutes. \n6. Serve hot with fresh cilantro, lime wedges and sliced jalapeños.",
    "categories": {
      "vegetarian": false,
      "vegan": false,
      "glutenFree": true,
      "dairyFree": true
    },
    "extendedIngredients": [
      {
        "id": 1001,
        "name": "butter",
        "amount": 1.5,
        "unit": "tbsp"
      },
      {
        "id": 2004,
        "name": "garlic",
        "amount": 3,
        "unit": "cloves"
      },
      {
        "id": 1017,
        "name": "ginger",
        "amount": 1,
        "unit": "tbsp"
      },
      {
        "id": 1020,
        "name": "red curry paste",
        "amount": 1,
        "unit": "tbsp"
      },
      {
        "id": 1005,
        "name": "chicken broth",
        "amount": 4,
        "unit": "cups"
      },
      {
        "id": 2047,
        "name": "rice noodles",
        "amount": 8,
        "unit": "oz"
      },
      {
        "id": 93608,
        "name": "coconut milk",
        "amount": 1,
        "unit": "can"
      },
      {
        "id": 6170,
        "name": "lime juice",
        "amount": 1,
        "unit": "tbsp"
      },
      {
        "id": 6179,
        "name": "fish sauce",
        "amount": 1,
        "unit": "tbsp"
      },
      {
        "id": 19334,
        "name": "brown sugar",
        "amount": 1,
        "unit": "tbsp"
      },
      {
        "id": 1019,
        "name": "red pepper flakes",
        "amount": 0.5,
        "unit": "tsp"
      }
    ],
    "servings": 4,
    "summary": "Spicy Thai Noodle Soup is a perfect recipe for a cold winter day. It is packed with flavor and is easy to make. This recipe is gluten-free and dairy-free, making it a great option for those with dietary restrictions."
  };

  getRecipeData(): Observable<Recipe> {
    return of(this.data);
  }


}
