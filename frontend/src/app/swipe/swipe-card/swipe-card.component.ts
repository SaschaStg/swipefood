import {Component, Input} from '@angular/core';
import {Recipe} from "../../models/recipe";
import {Router} from "@angular/router";
import {RemoveATagsService} from "../../services/remove-atags.service";

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss']
})
export class SwipeCardComponent {
  @Input() loading!: boolean;
  @Input() recipe!: Recipe;
  @Input() nextRecipe!: Recipe;

  imgError = false;

  constructor(private router: Router,
              public removeATagsService: RemoveATagsService,
  ) {
  }

  openRecipe(recipeId: string): void {
    const endpoint = `/recipes/${recipeId}`;
    this.router.navigate([endpoint]);
  }
}
