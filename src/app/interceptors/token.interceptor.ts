import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpContext
} from '@angular/common/http';
import { Observable, retry, switchMap } from 'rxjs';
import { TokenService } from '@services/token.service';
import { AuthService } from '@services/auth.service';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false)

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true)
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenSvc: TokenService,
    private authSvc: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.context.get(CHECK_TOKEN)) {
      const isValidToken = this.tokenSvc.isValidToken()

      if (isValidToken) {
        return this.addToken(request, next)
      } else {
        return this.updateAccessTokenAndRefreshToken(request, next)
      }

    }
    return next.handle(request)

  }

  private addToken(request: HttpRequest<unknown>, next: HttpHandler) {
    const access_token = this.tokenSvc.getToken()

    if (access_token) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${access_token}`)
      })
      return next.handle(authRequest)
    }
    return next.handle(request)
  }

  private updateAccessTokenAndRefreshToken(request: HttpRequest<unknown>, next: HttpHandler) {
    const refreshToken = this.tokenSvc.getRefreshToken()
    const isValidRefreshToken = this.tokenSvc.isValidRefreshToken()

    if (refreshToken && isValidRefreshToken) {
      return this.authSvc.refreshToken(refreshToken)
        .pipe(
          switchMap(() => this.addToken(request, next))
        )
    }
    return next.handle(request)
  }
}
