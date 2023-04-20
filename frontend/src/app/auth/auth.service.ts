import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {LocalStorageService} from "../services/local-storage.service";
import {catchError, map, Observable, of} from "rxjs";
import {apiRoot} from "../constants";
import {LoginResult} from "./login-result";

interface AccessTokenDto {
  access_token: string;
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

  login(username: string, password: string): Observable<LoginResult> {
    return this.http.post<AccessTokenDto>(`${this.authRoot}/login`, {username, password}).pipe(
      map(response => {
        this.updateToken(response.access_token)
        return LoginResult.Ok;
      }),
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case HttpStatusCode.Unauthorized:
            return of(LoginResult.WrongCredentials);
          case HttpStatusCode.InternalServerError:
            return of(LoginResult.ServerError);
          default:
            return of(LoginResult.NetworkError);
        }
      })
    )
  }

  private updateToken(token: string) {
    this.localStorage.setItem('token', token)
    this.token = token;
  }
}
