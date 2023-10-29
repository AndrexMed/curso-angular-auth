import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  apiUrl = environment.apiBaseURL

  constructor(private http: HttpClient) { }

  getBoard(id: Board['id']) {
    return this.http.get<Board>(`${this.apiUrl}/api/v1/boards/${id}`, {
      context: checkToken()
    })
  }

  getPosition(cards: Card[], currentIndex: number){
    console.log(cards, currentIndex)

    if(cards.length === 1){
      return "is new"
    }
    if(cards.length > 1 && currentIndex === 0){
      return "is the top"
    }
    const lastIndex = cards.length - 1
    if(cards.length > 2 && currentIndex > 0 && currentIndex < lastIndex){
      return "in the midle"
    }
    if(cards.length > 1 && currentIndex === lastIndex){
      return "in the bottom"
    }
    return 0;
  }
}
