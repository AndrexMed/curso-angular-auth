import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Board } from '@models/board.model';
import { User } from '@models/users.model';

@Injectable({
  providedIn: 'root'
})
export class MeService {

  apiUrl = environment.apiBaseURL

  constructor(private http: HttpClient) { }

  getMeProfile() {
    return this.http.get<User>(`${this.apiUrl}/api/v1/me/profile`, { context: checkToken() })
  }

  getMeBoards(){
    return this.http.get<Board[]>(`${this.apiUrl}/api/v1/me/boards`, { context: checkToken() })
  }
}
