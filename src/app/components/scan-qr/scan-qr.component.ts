import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { TypeSeance } from 'src/app/models/typeSeance.model';
import { Mouvement } from 'src/app/models/mouvement.model';
import {Md5} from 'ts-md5';
declare var $: any;

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.css']
})
export class ScanQRComponent implements OnInit {
  @ViewChild("montantCredit") montantCredit!: ElementRef;
  @ViewChild("refCheque") refCheque!: ElementRef;
  @ViewChild("nbJetonsCredit") nbJetonsCredit!: ElementRef;
  @ViewChild("date2") date2!: ElementRef;

  private noFFB!: string;
  private encrypted!: string;
  public user!: User;
  public isAdmin: boolean = false;
  public noSeanceYet:boolean = false;
  public seanceYet:boolean = false;
  public typesSeance!: TypeSeance[];
  public mouvements:Mouvement[]=[];
  public otherPlayCard:boolean = false;

  private prixJeton!:number;

  public displayCreditPopup:boolean = false;

  public soldeJetons!:number;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    var params: Params = this.route.snapshot.params;

    this.encrypted = params['encrypted'];
    
    this.noFFB = this.decryptUsingAES256(decodeURIComponent(params['encrypted']));

    if (localStorage.getItem("isAdmin")){
      this.adminProc();
      this.loadDebitsCredits(this.noFFB);
      /*
      this.http.get(environment.urlApi+"getAllUsers.php").subscribe(
        data => {
                (data as Array<User>).forEach(usr=>{
                  this.loadDebitsCredits(usr.noFFB);
                });
                //alert(this.noFFB)
                this.loadDebitsCredits(this.noFFB);
              });
      */
    } else {
      this.loadDebitsCredits(this.noFFB);
    }

    this.http.get(environment.urlApi+"getUser.php?noFFB="+this.noFFB).subscribe(
      data => {
        this.user=data as any;
        if (this.user.admin){
          localStorage.setItem("isAdmin","1");
          localStorage.setItem("idAdminEncrypted",this.encrypted);
          this.adminProc();
        } 
      }
    );
    
 
  }

  

private loadDebitsCredits(noFFB:String){
  var mouvements:Mouvement[]=[];
  this.http.get(environment.urlApi+"getDebitsFromUser.php?noFFB="+noFFB).subscribe(
    data => {
        (data as any).forEach( (cdt: { date: string; montant: number | null; nbJetons: number; }) => {
          var debit = new Mouvement("D", cdt.date, null, -cdt.nbJetons, null);
          mouvements.push(debit); 
      }
      );
      return this.loadCredits(noFFB,mouvements);
    }
  );
}

private loadCredits (noFFB:String,mouvements:Mouvement[]){
  this.http.get(environment.urlApi+"getCreditsFromUser.php?noFFB="+noFFB).subscribe(
    data => {
      (data as any).forEach( (cdt: { date: string; montant: number | null; nbJetons: number; }) => {
        var credit = new Mouvement("C", cdt.date, cdt.montant, cdt.nbJetons, null);
        mouvements.push(credit); 
      });
      return this.sortMouvements(noFFB,mouvements);
    }
  );
}

private sortMouvements(noFFB:String,mouvements:Mouvement[]){
  mouvements.sort((a,b)=>b.date.localeCompare(a.date))
  //var soldeJetons:number = this.user.soldeJetons!;
  //Calcul du solde final 
  var soldeJetons:number = 0;
  mouvements.forEach(mvt=>{
    soldeJetons!+=mvt.nbJetons!;
  })
  this.soldeJetons = soldeJetons;
  // Calcul du solde apres chaque mouvement 
  mouvements.forEach(mvt=>{
    mvt.soldeJetons = soldeJetons;
    soldeJetons!-=mvt.nbJetons!;
  })
  mouvements.push(new Mouvement(null,this.user.dateCreation!,null,null,soldeJetons));
  this.convertDates();

  this.http.get(environment.urlApi+"updateSoldeJoueur.php?noFFB="+noFFB+"&solde="+this.soldeJetons).subscribe(
    data=>{}
  );

  this.mouvements = mouvements;
}


  private convertDates(){
    this.mouvements.forEach(mvt=>{
      var spt1 = mvt.date.split(" ");
      var spt2 = spt1[0].split("-");
      mvt.date = spt2[2]+"-"+spt2[1]+"-"+spt2[0];
    })
  }

  private adminProc(){
    this.isAdmin = true;
    this.otherPlayCard = localStorage.getItem("idAdminEncrypted")!=this.encrypted;
    if (!this.otherPlayCard)
      localStorage.setItem("pass",(Md5.hashStr(this.noFFB+this.formatDate(new Date()))).substring(0,25));
    
    
    //var date = new Date();
    //var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();

    this.http.get(environment.urlApi+"getTodaySession.php").subscribe(
      data =>{
        if ((data as any).idSeance>0){
          this.seanceYet = true;
          localStorage.setItem("idSeance",(data as any).idSeance);
          this.openSeance();
        } else {
          this.noSeanceYet = true;
        }
      }
    )
    
  }

  private formatDate(inputDate:Date) {
    let date, month, year;
  
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
  
      date = date
          .toString()
          .padStart(2, '0');
  
      month = month
          .toString()
          .padStart(2, '0');
  
    return `${date}/${month}/${year}`;
  }

  public openSeance(){
      this.router.navigateByUrl("addUserToSession/"+encodeURIComponent(this.encrypted));
  }

  public reOpenSeance(){
    this.http.get(environment.urlApi+"reopenLastSession.php").subscribe();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigateByUrl("addUserToSession/"+encodeURIComponent(this.encrypted)));
  }


  public selectTypeSeance(){
    this.http.get(environment.urlApi+"getTypesSeance.php").subscribe(
      data => {
        this.typesSeance=data as any;  
      }
    );
  }

  public createSeance(idType:number){
    this.http.get(environment.urlApi+"createNewSession.php?type="+idType).subscribe(
      data => {
        localStorage.setItem("idSeance",(data as any).idSeance);
        var date = new Date();
        var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
        localStorage.setItem("dateDerniereSession",current_date);
        if (localStorage.getItem("date"))
          localStorage.removeItem("date");
        this.openSeance();
        }
    );
  }

  private decryptUsingAES256(str:string) {
    let _key = CryptoJS.enc.Utf8.parse(environment.saltEncryption);
    let _iv = CryptoJS.enc.Utf8.parse(environment.saltEncryption);
    str = str.replace(/\*/g,'\/');

    return CryptoJS.AES.decrypt(
      str, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8).replace(/\"/g,"");
  }

  public gotoEditUsers(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigateByUrl("editUsers"));
  }

  public disconnectAdmin(){
    this.noSeanceYet = false;
    this.seanceYet = false;
    this.isAdmin = false;
    localStorage.clear();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigateByUrl("/"));
  }

  
  public addCredit(usr:User){
    this.displayCreditPopup = true;
    setTimeout(() => {
      $(this.date2.nativeElement).datetimepicker({format:'d/m/Y'});
    }, 800);
    
    $.datetimepicker.setLocale('fr');
    this.http.get(environment.urlApi+"getTokenPrice.php?noFFB="+usr.noFFB).subscribe(
      data => {
       this.prixJeton = data as number;
      }
    );
  }
 public cancelCreditUser(){
    this.displayCreditPopup = false;
  }

  public addCreditValidation(usr:User){
    var montant = this.montantCredit.nativeElement.value;
    var refCheque = this.refCheque.nativeElement.value;
    var date = this.date2.nativeElement.value;
    this.displayCreditPopup = false;
    if (date){
      this.http.get(environment.urlApi+"creditUser.php?noFFB="+usr.noFFB+"&montant="+montant+"&refCheque="+refCheque+"&date="+date).subscribe(
        data => {
          this.mouvements=[];
          this.loadDebitsCredits(this.noFFB);
        }
      );
    } else
      this.http.get(environment.urlApi+"creditUser.php?noFFB="+usr.noFFB+"&montant="+montant+"&refCheque="+refCheque).subscribe(
        data => {
          this.mouvements=[];
          this.loadDebitsCredits(this.noFFB);
        }
      );
  }

  public keyupMontant(evt:any){
    this.nbJetonsCredit.nativeElement.value=Math.round(this.montantCredit.nativeElement.value/this.prixJeton);
  }

  public keyupJetons(evt:any){
    this.montantCredit.nativeElement.value=(this.nbJetonsCredit.nativeElement.value*this.prixJeton).toFixed(2);
  }
}
