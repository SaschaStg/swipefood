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
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ThemeToggleComponent} from './theme-toggle/theme-toggle.component';

@NgModule({
  declarations: [
    AppComponent,
    SwipeComponent,
    RecipeInformationComponent,
    ThemeToggleComponent
  ],
  imports: [
    // External modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    // Material modules
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule,
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
