import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from 'src/app/services/encryption.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent {
  allUsers: any = [];

  columnsToDisplay = ['noFFB', 'nom', 'prenom'];
  
  constructor( private http:HttpClient, private encryptionService : EncryptionService, private router:Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }


  loadUsers(): void {
    this.http.get(environment.urlApi+"getAllUsers.php").subscribe(
      data=>{
        this.allUsers = data;
      }
    )
    }
   
    public update(field:string,user:any){
      user["edit_"+field] = true;
      console.log(user);
      this.allUsers=this.allUsers;
    }

    public validate(field:string,user:any){
      var div = (document.getElementById(field+user.noFFB) as HTMLInputElement);
      var inp = (document.getElementById("inp_"+field+user.noFFB) as HTMLInputElement);
      user[field] = inp.value;
      user["edit_"+field] = false;
      
    } 

    public dropLine(user:any){
      var idx = this.allUsers.indexOf(user);
      if (confirm("Etes-vous sûr de vouloir supprimer "+user.prenom+" "+user.nom+" ?"))
        this.allUsers.splice(idx,1);
      
    }

    public addLine(){
      var idMax = 0;
      for (var i=0;i<this.allUsers.length;i++)
        if (this.allUsers[i].id>idMax)
          idMax = +this.allUsers[i].id;
      idMax++;
      var idMax2 = idMax.toString();
      var newMember : any = {id:idMax2,noFFB:"",nom:"",prenom:"",adherent:0,admin:0};
      newMember["id"]= idMax2;
      newMember["edit_noFFB"+idMax2]= true;
      newMember["edit_nom"+idMax2]= true;
      newMember["edit_prenom"+idMax2]= true;
      newMember["edit_adherent"+idMax2]= true;
      newMember["edit_admin"+idMax2]= true;
      newMember["newLine"]=true;

      this.allUsers.push(newMember);
      console.log(this.allUsers);
    }

    public save(){
      this.http.post(environment.urlApi+"postAllUsers.php",{data:this.allUsers}).subscribe(
        data => {
          alert("Les données ont bien été enregistrées");
          this.loadUsers();
        }
      );
    }

    public openInfoUser(usr: any){
      window.open('scanQR/'+this.encryptionService.encryptUsingAES256(usr.noFFB), "_blank");
    }

    public gotoPageUserCards(){
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigateByUrl("displayPageUserCards"));
    }
}
