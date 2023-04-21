import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {LocalStorageService} from "../services/local-storage.service";
import {catchError, map, Observable, of} from "rxjs";
import {apiRoot} from "../constants";
import {AuthResult} from "./auth-result";

interface AccessTokenDto {
  access_token: string;
}

interface RegisterDto {
  username: string;
  password: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authRoot = `${apiRoot}/auth`

  private token?: string;

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
  ) {
    this.token = localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.token
  }

  login(username: string, password: string): Observable<AuthResult> {
    return this.http.post<AccessTokenDto>(`${this.authRoot}/login`, {username, password}).pipe(
      map(response => {
        this.updateToken(response.access_token)
        return AuthResult.Ok;
      }),
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case HttpStatusCode.Unauthorized:
            return of(AuthResult.WrongCredentials);
          case HttpStatusCode.InternalServerError:
            return of(AuthResult.ServerError);
          default:
            return of(AuthResult.NetworkError);
        }
      })
    )
  }

  private updateToken(token: string) {
    this.localStorage.setItem('token', token)
    this.token = token;
  }

  register(registerData: RegisterDto): Observable<AuthResult> {
    return this.http.post<AccessTokenDto>(`${this.authRoot}/register`, registerData).pipe(
      map(result => {
        this.updateToken(result.access_token);
        return AuthResult.Ok;
      }),
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case HttpStatusCode.BadRequest:
            return of(AuthResult.WrongCredentials);
          case HttpStatusCode.InternalServerError:
            return of(AuthResult.ServerError);
          default:
            return of(AuthResult.NetworkError);
        }
      })
    )
  }
}
