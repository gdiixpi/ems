import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn : 'root'
})
export class AuthService {
    constructor(private myRoute: Router) { }
    
    sendToken(token: string) {
      localStorage.setItem(environment.LoggedInUser, token)
    }
    getToken() {
      return localStorage.getItem(environment.LoggedInUser)
    }
    isLoggedIn() {
      return this.getToken() !== null;
    }
    logout() {
      localStorage.removeItem(environment.LoggedInUser);
      this.myRoute.navigate(["login"]);
    }
}