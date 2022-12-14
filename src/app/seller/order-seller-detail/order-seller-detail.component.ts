import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Order} from "../../model/Order";
import {SellerService} from "../../service/seller/seller.service";
import {OrderDetail} from "../../model/OrderDetail";

@Component({
  selector: 'app-order-seller-detail',
  templateUrl: './order-seller-detail.component.html',
  styleUrls: ['./order-seller-detail.component.css']
})
export class OrderSellerDetailComponent implements OnInit {

  id: any;
  orderDetail: OrderDetail[] = [];
  // orderInOrderDetail: Order[] = [];
  constructor(private router: Router, private route: ActivatedRoute,private sellerService: SellerService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.sellerService.showOrderDetail(this.id).subscribe((data) =>{
        this.orderDetail = data;
        // this.orderDetail.order = data.order;
        // console.log(this.orderDetail)
        // console.log(data.order)
        console.log(data)
      })
    })
  }
  cancel(){
    this.router.navigate(["/seller/order-seller"]);
  }
}
