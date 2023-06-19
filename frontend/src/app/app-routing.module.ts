import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SwipeComponent} from "./swipe/swipe.component";
import {RecipeInformationComponent} from "./recipe-details/recipe-information.component";
import {WelcomeComponent} from './welcome/welcome.component';
import {authGuard} from "./auth/auth.guards";
import {LayoutComponent} from "./layout/layout/layout.component";
import {SettingsComponent} from "./settings/settings.component";
import {RecipeBookComponent} from "./recipe-book/recipe-book.component";
import {RecipeInputComponent} from "./recipe-input/recipe-input.component";

const routes: Routes = [
  {
    // Route for the landing page (no auth required)
    path: 'home',
    component: WelcomeComponent,
  },
  {
    // Top level route to handle auth -- used for the actual app after login
    path: '',
    canActivateChild: [authGuard], // Disable auth requirement by commenting out this line
    children: [
      {
        path: '',

        component: LayoutComponent,
        children: [
          {path: '', component: SwipeComponent},
          {path: 'settings', component: SettingsComponent},
          {path: 'recipe-input', component: RecipeInputComponent},
          {path: 'recipe-input/:id', component: RecipeInputComponent},
          {path: 'recipes/:id', component: RecipeInformationComponent},
          {path: 'cookbook', component: RecipeBookComponent},
          {path: ':id', component: SwipeComponent}
        ],
      },
      {path: 'recipes/:id', component: RecipeInformationComponent},
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
