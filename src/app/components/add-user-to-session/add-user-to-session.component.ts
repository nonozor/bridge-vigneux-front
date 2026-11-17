import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { EncryptionService } from 'src/app/services/encryption.service';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-add-user-to-session',
  templateUrl: './add-user-to-session.component.html',
  styleUrls: ['./add-user-to-session.component.css']
})
export class AddUserToSessionComponent implements OnInit, AfterViewInit {
  @ViewChild("montantCredit") montantCredit!: ElementRef;
  @ViewChild("refCheque") refCheque!: ElementRef;
  @ViewChild("date") date!: ElementRef;
  @ViewChild("date2") date2!: ElementRef;
  @ViewChild("nbJetonsCredit") nbJetonsCredit!: ElementRef;

  public users : User[] = [];
  public allUsers : User[] = [];
  public noFFBtoAdd! : string; 
  private userToAdd! : User;
  public usrAddCredit!: User;
  public displayCreditPopup : boolean = false;
  private prixJeton!: number;
  private dateSeance!: string;
  public selectedUsers!:any;
  
  constructor(private http: HttpClient, private route: ActivatedRoute, private router:Router, private encryptionService:EncryptionService) { }
  
  ngAfterViewInit(): void {

    $(this.date.nativeElement).datetimepicker({format:'d/m/Y H:i'});
    
    $.datetimepicker.setLocale('fr');
    setTimeout(() => {
      
      var dteTab = this.dateSeance.split(" ");
      var dte = dteTab[0].split("-");
      var h = dteTab[1].split(":");

      var dteStr = dte[2]+"/"+dte[1]+"/"+dte[0]+" "+h[0]+":"+h[1];
      this.date.nativeElement.value = dteStr;
      
    },1500);
    
    
  }

  private to2digits(nb:number){
    return ("0"+nb).slice(-2)
  }

  ngOnInit(): void {
    this.getTodaySessionPlayers(true);

    var params: Params = this.route.snapshot.params;
    this.noFFBtoAdd = this.encryptionService.decryptUsingAES256(decodeURIComponent(params['encrypted']));

    this.http.get(environment.urlApi+"getUser.php?noFFB="+this.noFFBtoAdd).subscribe(
      data => {
       this.userToAdd=data as any;
       if (this.userToAdd)
        this.addUser(this.userToAdd);
      }
    );
  }

  private getAllUsers(){
    this.http.get(environment.urlApi+"getAllUsers.php").subscribe(
      data => {
        this.allUsers=[];
       (data as User[]).forEach((usr: User) => {
          if (!this.users.find(u => u.noFFB == usr.noFFB))
            this.allUsers.push(usr);
       });
       this.allUsers.sort((a:User,b:User) => {
         const nameA = a.prenom ?? '';
         const nameB = b.prenom ?? '';
         if (nameA < nameB)
          return -1;
         else if (nameA > nameB)
          return 1;
         else
          return 0;
       });
       
       this.allUsers.forEach((usr:User) => {
         if (this.users.includes(usr))
           this.allUsers.splice(this.allUsers.indexOf(usr),1);
       });
      }
    );
  }


  private getTodaySessionPlayers(firstTime:boolean=false){
    this.http.get(environment.urlApi+"getTodaySession.php").subscribe(
      data => {
       this.users=(data as any).joueursPresents;
       this.dateSeance = (data as any).dateSeance;

       if (firstTime)
        this.getAllUsers();
      }
    );
  }

  private addUser(usr:User){
    if (localStorage.getItem("date"))
      this.http.get(environment.urlApi+"addUserToSession.php?noFFB="+usr.noFFB+"&idSeance="+localStorage.getItem("idSeance")+"&date="+localStorage.getItem("date")).subscribe(
        data => {
        this.getTodaySessionPlayers();
        }
      );
    else
      this.http.get(environment.urlApi+"addUserToSession.php?noFFB="+usr.noFFB+"&idSeance="+localStorage.getItem("idSeance")).subscribe(
        data => {
        this.getTodaySessionPlayers();
        }
      );
  }

  public addUserFromFFB(noFFB:string){
    if (localStorage.getItem("date"))
      this.http.get(environment.urlApi+"addUserToSession.php?noFFB="+noFFB+"&idSeance="+localStorage.getItem("idSeance")+"&date="+localStorage.getItem("date")).subscribe(
        data => {
        this.getTodaySessionPlayers();
        }
      );
    else
      this.http.get(environment.urlApi+"addUserToSession.php?noFFB="+noFFB+"&idSeance="+localStorage.getItem("idSeance")).subscribe(
        data => {
        this.getTodaySessionPlayers();
        }
      );
    const userToRemove = this.allUsers.find((usr:User) => usr.noFFB == noFFB);
    if (userToRemove) {
      this.allUsers.splice(this.allUsers.indexOf(userToRemove), 1);
    }
  }
  public addUsersFromFFB(){
    this.selectedUsers.forEach((noFFB:string) => {
      this.addUserFromFFB(noFFB);
    });
  }

  public cancelAddUser(usr:User){
    this.http.get(environment.urlApi+"removeUserFromSession.php?noFFB="+usr.noFFB+"&idSeance="+localStorage.getItem("idSeance")).subscribe(
      data => {
       this.getTodaySessionPlayers();
      }
    );
    this.allUsers.push(usr);
  }

  public addCredit(usr:User){
    this.usrAddCredit = usr;
    this.displayCreditPopup = true;
    setTimeout(() => {
      $(this.date2.nativeElement).datetimepicker({format:'d/m/Y'});
    },800);
    this.http.get(environment.urlApi+"getTokenPrice.php?noFFB="+this.usrAddCredit.noFFB).subscribe(
      data => {
       this.prixJeton = data as number;
      }
    );
  }

  public cancelCreditUser(){
    this.displayCreditPopup = false;
  }

  public addCreditValidation(usr:User){
    var montant = this.montantCredit.nativeElement.value.replace(",",".");
    var refCheque = this.refCheque.nativeElement.value;
    var date = this.date2.nativeElement.value;
    this.displayCreditPopup = false;
    if (date){
      this.http.get(environment.urlApi+"creditUser.php?noFFB="+usr.noFFB+"&montant="+montant+"&refCheque="+refCheque+"&date="+date).subscribe(
        data => {
        this.getTodaySessionPlayers();
        }
      );
    } else if (localStorage.getItem("date")){
      date = localStorage.getItem("date");
      this.http.get(environment.urlApi+"creditUser.php?noFFB="+usr.noFFB+"&montant="+montant+"&refCheque="+refCheque+"&date="+date).subscribe(
        data => {
        this.getTodaySessionPlayers();
        }
      );
    } else 
        this.http.get(environment.urlApi+"creditUser.php?noFFB="+usr.noFFB+"&montant="+montant+"&refCheque="+refCheque).subscribe(
          data => {
          this.getTodaySessionPlayers();
          }
        );
    }

  public disconnectAdmin(){
      localStorage.clear();
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigateByUrl("/"));
  }

  public gotoPageUserCards(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigateByUrl("displayPageUserCards"));
  }

  

  public closeSession(){
    this.http.get(environment.urlApi+"closeSession.php").subscribe(
      data => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigateByUrl("scanQR/"+localStorage.getItem("idAdminEncrypted")));
      }
    );
  }

  public close(){

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigateByUrl("quit"));
  }

  public setSessionDate(){
    this.http.get(environment.urlApi+"setOpenSessionDate.php?date="+this.date.nativeElement.value).subscribe(
      data => {
       if (!data){
        alert("Il y a plusieurs séance ouvertes simultanément, il est impossible de changer la date.")
       } else {
        alert("La date a bien été changée.");
        localStorage.setItem("date",this.date.nativeElement.value);
       }
      }
    );
  }

  public keyupMontant(evt:any){
    this.nbJetonsCredit.nativeElement.value=Math.round(this.montantCredit.nativeElement.value/this.prixJeton);
  }

  public keyupJetons(evt:any){
    this.montantCredit.nativeElement.value=(this.nbJetonsCredit.nativeElement.value*this.prixJeton).toFixed(2);;
  }
}


