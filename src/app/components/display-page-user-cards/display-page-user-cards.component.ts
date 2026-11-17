import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-display-page-user-caards',
  templateUrl: './display-page-user-cards.component.html',
  styleUrls: ['./display-page-user-cards.component.css']
})
export class DisplayPageUserCardsComponent implements OnInit {

  public users : User[] = [];
  private tableData: { column1: User; column2: User; }[]=[];
  public tablesData : { column1: User; column2: User; }[][]=[];
  public isAdmin = localStorage.getItem("isAdmin");
  private selectAll:boolean =false;
  public filter:boolean =false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (localStorage.getItem("isAdmin"))
      this.displayCards();
    
  }

  private displayCards(){
    this.http.get(environment.urlApi+"getAllUsers.php").subscribe(
      data => {
       this.users=data as any;
       this.initTables();
       console.log(this.tablesData)
      }
    );
  }

  private initTable () {
    this.tableData = this.users.reduce((acc:{column1:User,column2:User}[], col, i) => {
        col.checked = this.selectAll;
        if (i % 2 == 0) {
          acc.push({
            column1: col,
            column2: new User("",null,null,null,null,null,null,null)
          });
      } else {
          acc[acc.length - 1].column2 = col;
      }     
      return acc;
  }, []);
  }

  public initTables(){
    this.initTable();
    this.tablesData=[];
    var accTemp : {column1:User,column2:User}[]=[];
      for (var i=0;i<this.tableData.length;i++){
        if (i>0 && i%5==0){
          this.tablesData.push(accTemp);
          accTemp=[];
        }
        accTemp.push (this.tableData[i]);
      }
      if (accTemp.length<=5)
        this.tablesData.push(accTemp);
  }


  public selectAllAction(){
    this.selectAll=true;
    this.initTables();
  }

  public unselectAllAction(){
    this.selectAll=false;
    this.initTables();
  }

  public doSelect(){
    this.filter = true;
    this.users = this.users.filter(user =>  user.checked);
    this.initTables();
  }
  public uncheck(usr:User){
    usr.checked = !usr.checked;
  }
  public print(){
    window.print();
  }
}
