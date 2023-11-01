import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { CreateListDTO, List } from '@models/list.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  apiUrl = environment.apiBaseURL

  constructor(private http: HttpClient) { }

  create(dto: CreateListDTO) {
    return this.http.post<List>(`${this.apiUrl}/api/v1/lists`, dto, {
      context: checkToken()
    })
  }
}
