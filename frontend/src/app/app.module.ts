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
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ThemeToggleComponent} from './theme-toggle/theme-toggle.component';
import {RecipeBookComponent} from "./recipe-book/recipe-book.component";
import {MatTableModule} from "@angular/material/table";
import {SwipeCardComponent} from './swipe/swipe-card/swipe-card.component';
import {HeaderComponent} from "./layout/header/header.component";
import {FooterComponent} from "./layout/footer/footer.component";
import {LayoutComponent} from "./layout/layout/layout.component";
import {NgOptimizedImage} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SettingsComponent} from "./settings/settings.component";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {RecipeInputComponent} from './recipe-input/recipe-input.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {WelcomeComponent} from './welcome/welcome.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    RecipeBookComponent,
    RecipeInformationComponent,
    RecipeInputComponent,
    SettingsComponent,
    SwipeCardComponent,
    SwipeComponent,
    ThemeToggleComponent,
    WelcomeComponent,
  ],
  imports: [
    // External modules
    BrowserAnimationsModule,
    BrowserModule,
    CdkDrag,
    FormsModule,
    HammerModule,
    HttpClientModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    // Material modules
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
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
