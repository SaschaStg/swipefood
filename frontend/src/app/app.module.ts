import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SwipeComponent} from './swipe/swipe.component';
import {MatCardModule} from "@angular/material/card";
import {RecipeInformationComponent} from './recipe-details/recipe-information.component';
import {AppRoutingModule} from "./app-routing.module";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {httpInterceptorProviders} from "./http-interceptors";

@NgModule({
  declarations: [
    AppComponent,
    SwipeComponent,
    RecipeInformationComponent
  ],
  imports: [
    // External modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Material modules
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    // Routing module
    AppRoutingModule,
  ],
  providers: [
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
