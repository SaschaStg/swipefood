import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SwipeComponent} from './swipe/swipe.component';
import {MatCardModule} from "@angular/material/card";
import {RecipeDetailsComponent} from './recipe-details/recipe-details.component';
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    SwipeComponent,
    RecipeDetailsComponent
  ],
  imports: [
    // External Modules
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    // Routing Module
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
