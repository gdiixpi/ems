import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.isLoggedIn()){
        return true;
      }else{
        this.router.navigate(["login"]);
        return false;
      }
    }
  
    // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    // boolean | Observable<boolean> | Promise<boolean> {
    //   return this.canActivate(next, state);
    // }
  
  
}
