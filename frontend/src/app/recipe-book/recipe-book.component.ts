import {Component, OnInit} from '@angular/core';
import {Recipe} from "../models/recipe";
import {RecipeService} from "../services/recipe.service";

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.scss']
})
export class RecipeBookComponent implements OnInit {

  likedRecipes?: Recipe[];
  customRecipes?: Recipe[];

  constructor(private recipeService: RecipeService) {

  }

  ngOnInit(): void {
    this.recipeService.getLikedRecipes().subscribe(
      (data: Recipe[]) => {
        this.likedRecipes = data;
      });

    this.recipeService.getCustomUserRecipes().subscribe(
      (data: Recipe[]) => {
        this.customRecipes = data;
      });
  }
}
