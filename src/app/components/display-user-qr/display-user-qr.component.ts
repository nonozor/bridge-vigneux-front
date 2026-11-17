import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-display-user-qr',
  templateUrl: './display-user-qr.component.html',
  styleUrls: ['./display-user-qr.component.css']
})
export class DisplayUserQRComponent implements OnInit {
  @Input() user!: User;
  public url : string = environment.frontUrl;

  constructor(private encryptionService:EncryptionService) { }

  ngOnInit(): void {
    var encrypted = this.encryptionService.encryptUsingAES256(this.user.noFFB+"");
    this.url+="scanQR/"+encodeURIComponent(encrypted);
  }

  

}
