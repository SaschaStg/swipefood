import {NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SwipeComponent} from './swipe/swipe.component';
import {MatCardModule} from "@angular/material/card";
import {RecipeInformationComponent} from './recipe-details/recipe-information.component';
import {AppRoutingModule} from "./app-routing.module";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {httpInterceptorProviders} from "./http-interceptors";
import {MatTableModule} from "@angular/material/table";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {SwipeCardComponent} from './swipe/swipe-card/swipe-card.component';
import {HeaderComponent} from "./layout/header/header.component";
import {FooterComponent} from "./layout/footer/footer.component";
import {LayoutComponent} from "./layout/layout/layout.component";
import {NgOptimizedImage} from "@angular/common";
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
    SwipeCardComponent,
    ThemeToggleComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
  ],
  imports: [
    // External modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HammerModule,
    // Material modules
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule,
    // Routing module
    AppRoutingModule,
    MatTableModule,
    NgxSkeletonLoaderModule,
    CdkDrag,
    NgOptimizedImage,
  ],
  providers: [
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
