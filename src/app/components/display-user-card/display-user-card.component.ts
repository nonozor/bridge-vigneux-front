import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-display-user-card',
  templateUrl: './display-user-card.component.html',
  styleUrls: ['./display-user-card.component.css']
})
export class DisplayUserCardComponent implements AfterViewInit  {
  @Input() user!: User;
  @Input() displayadherent: boolean = true;

  constructor() { }

  ngAfterViewInit(): void {
  }

}
