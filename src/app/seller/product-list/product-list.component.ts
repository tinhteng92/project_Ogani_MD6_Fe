import { Component, OnInit } from '@angular/core';
import {Product} from "../../model/Product";
import {SellerService} from "../../service/seller/seller.service";
import {LoginService} from "../../service/login/login.service";
import {ScriptService} from "../../script.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Page} from "../../model/Page";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  p: any;
  constructor (private sellerService: SellerService, public loginService : LoginService,
    private activatedRoute: ActivatedRoute,private script: ScriptService,private router: Router) { }

  ngOnInit(): void {
    this.getRequest();

    console.log("username: ", this.loginService.getUserToken().username)
    this.sellerService.showListProducts(this.loginService.getUserToken().username, 0 ).subscribe((data) => {
      this.products = data.content;
      console.log(this.products)
    })
  }

  getRequest(){
    // alert(this.loginService.getUserToken().username);
    this.sellerService.showListProducts(this.loginService.getUserToken().username,5).subscribe(products => {
      this.products = products;
    })
  }

  showProductsByPriceASC(){
    this.sellerService.showProductsByPriceASC(this.loginService.getUserToken().id).subscribe((data) => {
      this.products = data;
      console.log(this.products)
    })
  }

  showProductsByPriceDESC(){
    this.sellerService.showProductsByPriceDESC(this.loginService.getUserToken().id).subscribe((data) => {
      this.products = data;
      console.log(this.products)
    })
  }
}
