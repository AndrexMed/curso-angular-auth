import { Component, Input, OnInit } from '@angular/core';
import { COLORS, Colors } from '@models/color.model';

@Component({
  selector: 'app-card-color',
  templateUrl: './card-color.component.html'
})
export class CardColorComponent implements OnInit{

  @Input() color: Colors = 'sky'

  mapColors = COLORS

  constructor() { }
  
  ngOnInit(): void {
    console.log("From card-color-components.ts")
  }

  get colors() {
    const classes = this.mapColors[this.color]
    return classes ? classes : {}
  }

}
