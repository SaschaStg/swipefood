import {Component, OnInit} from '@angular/core';
import {Recipe} from "../models/recipe";
import {RecipeService} from "../services/recipe.service";
import {MatTableDataSource} from "@angular/material/table";
import {Ingredients} from "../models/ingredients";
import {ActivatedRoute} from "@angular/router";
import {RemoveATagsService} from "../services/remove-atags.service";
import {SnackBarService} from "../services/snackbar.service";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-information.component.html',
  styleUrls: ['./recipe-information.component.scss']
})

export class RecipeInformationComponent implements OnInit {

  recipe?: Recipe;
  displayedColumns: string[] = ['amount', 'unit', 'name'];
  dataSource: MatTableDataSource<Ingredients> = new MatTableDataSource<Ingredients>();

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    public removeATagsService: RemoveATagsService,
    private snackBarService: SnackBarService,
  ) {
    this.dataSource = new MatTableDataSource<Ingredients>();
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');

      if (recipeId) {
        this.recipeService.getRecipeById(recipeId).subscribe({
          next: (data) => {
            this.recipe = data;
            this.dataSource.data = this.recipe.ingredients.map(ingredient => {
              return {
                amount: ingredient.amount,
                unit: ingredient.unit,
                name: ingredient.name
              };
            });
          },
          error: (err) => {
            console.error(err);
            this.snackBarService.openSnackBar('No recipe ID found in route', "warn");
          }
        });
      } else {
        console.error('No recipe ID found in route');
        this.snackBarService.openSnackBar('No recipe ID found in route', "warn");
      }
    })
  }


}
