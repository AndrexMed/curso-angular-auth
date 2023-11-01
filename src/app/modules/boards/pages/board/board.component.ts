import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { ActivatedRoute } from '@angular/router';
import { BoardsService } from '@services/boards.service';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';
import { CardsService } from '@services/cards.service';
import { List } from '@models/list.model';
import { FormControl, Validators } from '@angular/forms';
import { ListService } from '@services/list.service';
import { BACKGROUNDS } from '@models/color.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit {

  faClose = faClose

  board: Board | null = null;
  //showCardForm = false
  inputCard = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  inputList = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  showListForm = false
  colorBackgrounds = BACKGROUNDS

  constructor(private dialog: Dialog,
    private route: ActivatedRoute,
    private boardSvc: BoardsService,
    private cardSvc: CardsService,
    private listSvc: ListService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => {
        const id = params.get('boardId')

        if (id) {
          this.getBoard(id)
        }
      })
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) { //SI el elemento arrastrado esta entre la misma lista
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {//sino...
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    //Despues...
    const position = this.boardSvc.getPosition(event.container.data, event.currentIndex)
    console.log(position)

    const card = event.container.data[event.currentIndex]
    const listId = event.container.id;
    console.log("listId: ", listId)
    this.updateCard(card, position, listId)
  }

  addList() {
    const title = this.inputList.value;
    console.log(title)
    if (this.board) {
      this.listSvc.create({
        title,
        boardId: this.board.id,
        position: this.boardSvc.getPositionNewItem(this.board.lists)
      })
        .subscribe(list => {
          this.board?.lists.push({
            ...list,
            cards: []
          })
          this.showListForm = true
          this.inputList.setValue('')
        })
    }
  }

  openDialog(card: Card) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      console.log(output);
    });
  }

  private getBoard(id: string) {
    this.boardSvc.getBoard(id)
      .subscribe(board => {
        this.board = board
      })
  }

  private updateCard(card: Card, position: number, listId: number | string) {
    this.cardSvc.update(card.id, { position, listId })
      .subscribe((cardUpdated) => {
        console.log(cardUpdated)
      })
  }

  openFormCard(list: List) {
    //list.showCardForm = !list.showCardForm
    //list => false todos
    //list click true
    if (this.board?.lists) {
      this.board.lists = this.board.lists.map(iteratorList => {
        if (iteratorList.id === list.id) {
          return {
            ...iteratorList,
            showCardForm: true
          }
        }
        return {
          ...iteratorList,
          showCardForm: false
        }
      });
    }
  }

  createCard(list: List) {
    const title = this.inputCard.value;
    console.log(title)

    if (this.board) {
      this.cardSvc.create({
        title,
        listId: list.id,
        boardId: this.board.id,
        position: this.boardSvc.getPositionNewItem(list.cards)
      }).subscribe(card => {
        list.cards.push(card)
        this.inputCard.setValue("")
        list.showCardForm = false;
      })
    }
  }

  closeCardForm(list: List) {
    list.showCardForm = false
  }

  get colors() {
    if (this.board) {
      const classes = this.colorBackgrounds[this.board.backgroundColor]
      return classes ? classes : {}
    }
    return {}
  }
}
