import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SwipeComponent} from "./swipe/swipe.component";
import {RecipeInformationComponent} from "./recipe-details/recipe-information.component";
import {authGuard} from "./auth/auth.guards";

const routes: Routes = [
  {
    // Top level route to handle auth
    path: '',
    canActivateChild: [authGuard], // Disable auth requirement by commenting out this line
    children: [
      {
        path: '',
        component: SwipeComponent,
      },
      {
        path: 'information',
        component: RecipeInformationComponent,
      },
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
