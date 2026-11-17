import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { filter, map, Observable, tap } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var  headers = localStorage.getItem("pass") ? new HttpHeaders()
           .append('Authorization', 'Bearer '+localStorage.getItem("pass")) : new HttpHeaders();
        var modifiedReq = req.clone({ headers, params: req.params});
        
        return next.handle(modifiedReq);
    }
}