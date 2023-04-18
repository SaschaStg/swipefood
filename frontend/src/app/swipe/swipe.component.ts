import {Component, OnInit} from '@angular/core';
import {RecipeService} from "../services/recipe.service";
import {Recipe} from "../models/recipe";

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.css']
})

export class SwipeComponent implements OnInit {

  recipe?: Recipe;

  constructor(private recipeService: RecipeService) {

  }

  ngOnInit(): void {
    this.recipeService.getRecipeData().subscribe(data => {
      this.recipe = data;
    });
  }
}
