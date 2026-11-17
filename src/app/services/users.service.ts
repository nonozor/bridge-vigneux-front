import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  users() {
    return this.http.get(environment.urlApi+"getAllUsers.php");
  }
}