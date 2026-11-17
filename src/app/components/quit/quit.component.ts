import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quit',
  templateUrl: './quit.component.html',
  styleUrls: ['./quit.component.css']
})
export class QuitComponent implements OnInit {
  constructor( private location: Location ){}
  ngOnInit(){
    this.location.go("quit");
  }
}
