import {Component, OnInit} from '@angular/core';
import {Recipe} from "../models/recipe";
import {RecipeService} from "../services/recipe.service";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  recipe?: Recipe;

  constructor(private recipeService: RecipeService) {

  }

  ngOnInit(): void {
    this.recipeService.getRecipeData().subscribe(data => {
      this.recipe = data;
    });
  }
}
