import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-editable',
  templateUrl: './editable.component.html',
  styleUrls: ['./editable.component.css']
})
export class EditableComponent {
  @Input() object!: any;
  @Input() field!: string;
  @Input() id!: string;

  private inp!:HTMLInputElement;

  public update(){
    this.object["edit_"+this.field+this.object[this.id]] = true;
    
    setTimeout(() => {  
      var inp = (document.getElementById("inp_"+this.field+this.object[this.id]) as HTMLInputElement);
      inp.focus(); }
      , 500);
  }


  public validate(){
     var inp = (document.getElementById("inp_"+this.field+this.object[this.id]) as HTMLInputElement);
     if (inp.value!=""){
        this.object[this.field] = inp.value;
        setTimeout(() => {
          this.object["edit_"+this.field+this.object[this.id]] = false;
        },50);
     }
  }
}
