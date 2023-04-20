import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

import {LoginComponent} from './login/login.component';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    // External modules
    CommonModule,
    ReactiveFormsModule,
    // Routing module
    AuthRoutingModule,
    // Material modules
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: []
})
export class AuthModule {
}
