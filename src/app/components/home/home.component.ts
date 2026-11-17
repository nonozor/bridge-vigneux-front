import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private router:Router) { }

ngOnInit(): void {
    if (localStorage.getItem("isAdmin")){
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigateByUrl("scanQR/"+localStorage.getItem("idAdminEncrypted")));
    }
    
  }

  ngAfterViewInit(){

  }

}
