import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '@models/users.model';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = `${environment.apiBaseURL}`

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/api/v1/users`, { context: checkToken() })
  }
}
