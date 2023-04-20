import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SwipeComponent} from "./swipe/swipe.component";
import {RecipeInformationComponent} from "./recipe-details/recipe-information.component";

const routes: Routes = [
  {
    path: '',
    component: SwipeComponent,
  },
  {
    path: 'information',
    component: RecipeInformationComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
