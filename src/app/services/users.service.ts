import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '@models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = `${environment.apiBaseURL}`

  constructor(private tokenSvc: TokenService,
    private http: HttpClient
  ) { }

  getUsers() {
    const token = this.tokenSvc.getToken()
    return this.http.get<User[]>(`${this.apiUrl}/api/v1/users`, { headers: {
      Authorization: `Bearer ${token}`
    }})
  }
}
