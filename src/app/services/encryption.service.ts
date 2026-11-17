import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() {

   }

   public decryptUsingAES256(str:string) {
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

  public encryptUsingAES256(str:string) {
    let _key = CryptoJS.enc.Utf8.parse(environment.saltEncryption);
    let _iv = CryptoJS.enc.Utf8.parse(environment.saltEncryption);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(str), _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    return(encrypted.toString().replace(/\//g,'*'));
  }

  
}
