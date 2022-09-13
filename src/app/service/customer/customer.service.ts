import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Customer} from "../../model/Customer";
import {Seller} from "../../model/Seller";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

  findCustomerByUserName(username: string): Observable<Customer>{
    return this.http.post<Customer>("http://localhost:8080/customers/findCustomerByUserName",username);
  }

  findSellerByProductId(id: number):Observable<Seller>{
    return this.http.post<Seller>("http://localhost:8080/customers/findSellerByProductId",id);
  }
}