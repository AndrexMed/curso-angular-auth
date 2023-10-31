import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '@models/color.model';
import { BoardsService } from '@services/boards.service';
@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html'
})
export class BoardFormComponent {

  @Output() closeOverlay = new EventEmitter<boolean>()

  faCheck = faCheck

  form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    backgroundColor: new FormControl<Colors>('sky', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(private formBuilder: FormBuilder,
    private boardSvc: BoardsService,
    private router: Router) { }

  doSave() {
    if (this.form.valid) {
      const { title, backgroundColor } = this.form.getRawValue();
      console.log(title, backgroundColor);
      this.boardSvc.createBoard(title, backgroundColor)
        .subscribe(board => {
          console.log(board)
          this.closeOverlay.next(false)
          this.router.navigate(['/app/boards', board.id])
        })
    } else {
      this.form.markAllAsTouched();
      console.log("Error form")
    }
  }
}
