import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenService } from '@services/token.service';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private tokenSvc: TokenService,
    private route: Router) { }

  canActivate(): boolean {
    const isValidToken = this.tokenSvc.isValidRefreshToken()

    if (isValidToken) {
      this.route.navigate(['/app'])
    }
    return true;
  }

}
