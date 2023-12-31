import {Component, OnInit} from '@angular/core';
import {Recipe} from "../models/recipe";
import {RecipeService} from "../services/recipe.service";
import {SnackBarService} from "../services/snackbar.service";
import {NavigateService} from "../services/navigate.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.scss']
})
export class RecipeBookComponent implements OnInit {

  likedRecipes?: Recipe[];
  customRecipes?: Recipe[];
  likedRecipesLoading = false;
  customRecipesLoading = false;

  imgError = false;

  constructor(
    private recipeService: RecipeService,
    private snackBarService: SnackBarService,
    private navigateService: NavigateService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.likedRecipesLoading = true;
    this.customRecipesLoading = true;
    this.recipeService.getLikedRecipes().subscribe({
      next: (data) => {
        this.likedRecipes = data;
        this.likedRecipesLoading = false;
      },
      error: (err) => {
        this.snackBarService.openSnackBar("can´t load liked recipes!", "warn");
        console.log(err);
      }
    });

    this.recipeService.getCustomUserRecipes().subscribe({
      next: (data) => {
        this.customRecipes = data;
        this.customRecipesLoading = false;
      },
      error: (err) => {
        this.snackBarService.openSnackBar("can´t load custom recipes!", "warn");
        console.log(err);
      }
    });
  }

  openRecipe(recipeId: string): void {
    const endpoint = `/recipes/${recipeId}`;
    this.navigateService.navigateTo(this.router.url, endpoint);
  }
}
