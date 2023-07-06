import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {RecipeService} from "../services/recipe.service";
import {Recipe} from "../models/recipe";
import {CdkDrag, CdkDragEnd, CdkDragMove} from '@angular/cdk/drag-drop';
import {ActivatedRoute, Router} from "@angular/router";
import {SwipeContainerColor} from "./swipe-container-color";
import {SnackBarService} from "../services/snackbar.service";

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.scss'],
  animations: [],
})

export class SwipeComponent implements OnInit {
  @ViewChild(CdkDrag) dragElement!: CdkDrag;

  recipe?: Recipe;
  nextRecipe?: Recipe;
  isDragging = false;
  card1 = true;
  loadingCard1 = false;
  loadingCard2 = false;
  cardsDisabled = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    public renderer: Renderer2,
    private elementRef: ElementRef,
    private snackBarService: SnackBarService,
  ) {
  }

  //load both recipes for card1 and card2 on start
  ngOnInit(): void {
    const errormessage = "can´t load recipe!"
    const style = "warn"
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');
      if (recipeId) {
        this.recipeService.getRecipeById(recipeId).subscribe({
          next: (data) => {
            this.recipe = data;
            this.recipeService.getRandomRecipe().subscribe({
              next: (data) => {
                this.nextRecipe = data;
              },
              error: (err) => {
                this.snackBarService.openSnackBar(errormessage, style);
                console.log(err)
              }
            });
          },
          error: (err) => {
            this.snackBarService.openSnackBar(errormessage, style);
            console.log(err)
          }
        });
      } else {
        this.recipeService.getRandomRecipe().subscribe({
          next: (data) => {
            this.recipe = data;
            this.recipeService.getRandomRecipe().subscribe({
              next: (data) => {
                this.nextRecipe = data;
              },
              error: (err) => {
                this.snackBarService.openSnackBar(errormessage, style);
                console.log(err)
              }
            });
          },
          error: (err) => {
            this.snackBarService.openSnackBar(errormessage, style);
            console.log(err)
          }
        });
      }
    })
  }

  // this function is called when the user swiped a recipe
  // it will load a new recipe for the card that is not currently visible
  // it will also change the z-index of the cards so that the card that is not visible is on top
  nextCard(): boolean {
    const currentCard = this.card1;
    if (this.card1) {
      this.loadingCard1 = true;
      this.recipeService.getRandomRecipe().subscribe((data) => {
        this.recipe = data;
        this.loadingCard1 = false;
      });
      this.changeElementZIndex('card1', 0);
      this.changeElementZIndex('card2', 5);
      this.card1 = false;
    } else {
      this.loadingCard2 = true;
      this.recipeService.getRandomRecipe().subscribe((data) => {
        this.nextRecipe = data;
        this.loadingCard2 = false;
      });
      this.changeElementZIndex('card1', 5);
      this.changeElementZIndex('card2', 0);
      this.card1 = true;
    }

    return currentCard;
  }

  // this function is called when the user is dragging a card
  // it will rotate the card based on the distance the user dragged the card
  onSwipe(event: CdkDragMove) {
    if (!this.isDragging) {
      this.isDragging = true;
    }

    const deltaX = event.distance.x;
    const rotation = deltaX / 10;

    this.renderer.setStyle(
      event.source.element.nativeElement,
      'transform',
      `translateX(${deltaX}px) rotate(${rotation}deg)`
    );

    const swipeContainerColor = new SwipeContainerColor(this.card1);
    swipeContainerColor.updateColor(deltaX);
  }

  // this function is called when the user stopped dragging a card
  // it will check if the user dragged the card far enough (tolerance) to the left or right
  // if the user dragged the card far enough to the left, the nextCard() function will be called
  onSwipeEnd(event: CdkDragEnd) {
    if (!this.isDragging) {
      return;
    }

    const deltaX = event.distance.x;
    const tolerance = 150;

    const swipeAction = deltaX < -tolerance ? 'DISLIKE' : deltaX > tolerance ? 'LIKE' : null;

    if (swipeAction) {
      const elementId = swipeAction === 'DISLIKE' ? '#dislike' : '#like';
      const likeElement = this.elementRef.nativeElement.querySelector(elementId);
      this.renderer.setStyle(likeElement, 'display', 'block');
      this.hideCard(likeElement);

    } else {
      const swipeContainerId = this.card1 ? 'color-container1' : 'color-container2';
      const swipeContainer = document.querySelector(`#${swipeContainerId}`) as HTMLElement
      swipeContainer.style.backgroundColor = 'transparent';
      this.renderer.removeStyle(event.source.element.nativeElement, 'transform');
    }
    this.isDragging = false;
  }

  moveCard(deltaX: number, rotation: number) {
    const currentCardId = this.card1 ? 'card1' : 'card2';
    const cardElement = this.elementRef.nativeElement.querySelector(`#${currentCardId}`);
    this.renderer.setStyle(cardElement, 'transform', `translateX(${deltaX}px) rotate(${rotation}deg)`);
  }

  //this function handles the visibility for the card when swiped and calls the needed functions
  //it also calls the function addRecipeToUser to add the recipe to the database
  hideCard(likeOrDislikeElement: HTMLElement) {
    const swipeContainerColor = new SwipeContainerColor(this.card1);
    const currentCardId = this.card1 ? 'card1' : 'card2';
    const cardElement = this.elementRef.nativeElement.querySelector(`#${currentCardId}`);
    this.addRecipeToUser(likeOrDislikeElement);
    this.cardsDisabled = true;
    this.buttonTimeout(likeOrDislikeElement);
    setTimeout(() => {
      this.renderer.setStyle(cardElement, 'display', 'none');
      this.renderer.removeStyle(cardElement, 'transform');
      swipeContainerColor.clearColorContainer();
      this.nextCard();
      setTimeout(() => {
        this.renderer.setStyle(cardElement, 'display', 'block');
        this.cardsDisabled = false;
      }, 100);
    }, 700);
  }


  //this function calls the endpoints to add the recipe to the database
  addRecipeToUser(likeOrDislikeElement: HTMLElement) {
    if (this.recipe) {
      const elementId = likeOrDislikeElement.id;

      if (elementId === 'like') {
        if (this.card1) {
          this.recipeService.addRecipeToUser(this.recipe.id, true).subscribe();
        } else {
          this.recipeService.addRecipeToUser(this.nextRecipe!.id, true).subscribe();
        }
      }
      if (elementId === 'dislike') {
        if (this.card1) {
          this.recipeService.addRecipeToUser(this.recipe.id, false).subscribe();
        } else {
          this.recipeService.addRecipeToUser(this.nextRecipe!.id, false).subscribe();
        }
      }
    }
  }

  dislikeButton() {
    const dislikeElement = this.elementRef.nativeElement.querySelector('#dislike');
    const swipeContainerColor = new SwipeContainerColor(this.card1);
    swipeContainerColor.updateColor(-200);
    this.renderer.setStyle(dislikeElement, 'display', 'block');
    this.moveCard(-200, -20);
    this.hideCard(dislikeElement);
    this.buttonTimeout(dislikeElement);
  }

  likeButton() {
    const likeElement = this.elementRef.nativeElement.querySelector('#like');
    const swipeContainerColor = new SwipeContainerColor(this.card1);
    swipeContainerColor.updateColor(200);
    this.renderer.setStyle(likeElement, 'display', 'block');
    this.moveCard(200, 20);
    this.hideCard(likeElement);
    this.buttonTimeout(likeElement);
  }

  buttonTimeout(element: HTMLElement) {
    const likeButton = this.elementRef.nativeElement.querySelector('#likeButton');
    const dislikeButton = this.elementRef.nativeElement.querySelector('#dislikeButton');
    this.renderer.setProperty(likeButton, 'disabled', true);
    this.renderer.setProperty(dislikeButton, 'disabled', true);
    setTimeout(() => {
      this.renderer.setStyle(element, 'display', 'none');
      this.renderer.setProperty(likeButton, 'disabled', false);
      this.renderer.setProperty(dislikeButton, 'disabled', false);

    }, 700);
  }

  changeElementZIndex(elementId: string, zIndex: number): void {
    const element = this.elementRef.nativeElement.querySelector(`#${elementId}`);
    if (element) {
      this.renderer.setStyle(element, 'z-index', zIndex);
    }
  }
}
