import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  bufferSpace = 65535;

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
      this.bufferSpace
      //return "is new"
      return this.bufferSpace
    }
    if(cards.length > 1 && currentIndex === 0){
      const onTopPosition = cards[1].position;
      return onTopPosition / 2
      //return "is the top"
    }
    const lastIndex = cards.length - 1
    if(cards.length > 2 && currentIndex > 0 && currentIndex < lastIndex){
      const prevPosition = cards[currentIndex - 1].position;
      const nextPosition = cards[currentIndex + 1].position;
      return (prevPosition + nextPosition) / 2
      //return "in the midle"
    }
    if(cards.length > 1 && currentIndex === lastIndex){
      const onBottomPosition = cards[lastIndex - 1].position;
      return onBottomPosition + this.bufferSpace
      //return "in the bottom"
    }
    return 0;
  }
}
