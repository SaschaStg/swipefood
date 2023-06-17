import {Injectable} from '@angular/core';
import {apiRoot} from "../constants";
import {HttpClient} from "@angular/common/http";
import {Diet} from "./diet";
import {Observable} from "rxjs";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly authRoot = `${apiRoot}/users`
  constructor(
    private http: HttpClient,
  ) {
  }

  getUserName():Observable<User> {
    return this.http.get<User>(`${this.authRoot}/me`);
  }

  patchUserDiet(diet:Diet):Observable<Diet>{
    return this.http.patch<Diet>(`${this.authRoot}/me/diet`, diet);
  }
}