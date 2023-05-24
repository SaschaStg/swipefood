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

interface JwtPayload {
  sub: number;
  displayName: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authRoot = `${apiRoot}/auth`

  private _token: string | null = null;
  private tokenPayload: JwtPayload | null = null;

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
  ) {
    this.token = localStorage.getItem('token');
  }

  get token(): string | null {
    return this._token;
  }

  private set token(value: string | null) {
    this._token = value;
    if (value) {
      this.tokenPayload = JSON.parse(atob(value.split('.')[1]));
      if (!this.tokenPayload) {
        // Invalid token
        this.clearToken();
        return;
      }

      const expiryTime = this.tokenPayload.exp * 1000;
      if (Date.now() > expiryTime) {
        // Token is expired
        this.clearToken();
      }
    }
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

  logout() {
    this.clearToken();
  }

  private updateToken(token: string) {
    this.localStorage.setItem('token', token)
    this.token = token;
  }

  private clearToken() {
    this.localStorage.removeItem('token');
    this.token = null;
    this.tokenPayload = null;
  }
}
