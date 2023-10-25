import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, catchError, switchMap, tap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { ResponseLogin } from '@models/auth.model';
import { User } from '@models/users.model';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new BehaviorSubject<User | null>(null)

  apiUrl = `${environment.apiBaseURL}`

  constructor(private http: HttpClient,
    private tokenSvc: TokenService) { }

  login(email: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/login`, { email, password })
      .pipe(
        tap(response => {
          this.tokenSvc.saveToken(response.access_token)
          this.tokenSvc.saveRefreshToken(response.refresh_token)
        })
      )
  }

  logout() {
    return this.tokenSvc.removeToken()
  }

  register(name: string, email: string, password: string) {
    return this.http
      .post(`${this.apiUrl}/api/v1/auth/register`, { name, email, password })
      .pipe(
        catchError((error) => {
          //console.log("errror from service ", error)
          if (error.error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return throwError('The user already exist');
          }
          return throwError('Ups algo salio mal');
        })
      )
  }

  isAvailable(email: string) {
    return this.http.post<{ isAvailable: boolean }>(`${this.apiUrl}/api/v1/auth/is-available`, { email })

  }

  registerAndLogin(name: string, email: string, password: string) {
    return this.register(name, email, password)
      .pipe(
        switchMap(() => this.login(email, password))
      )
  }

  recovery(email: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/recovery`, { email })
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/change-password`, { token, newPassword })
  }

  profile() {
    const token = this.tokenSvc.getToken()
    return this.http.get<User>(`${this.apiUrl}/api/v1/auth/profile`, { context: checkToken() })
      .pipe(
        tap(user => {
          this.user$.next(user)
        })
      )
  }

  getDataUser() {
    this.user$.getValue()
  }
}
