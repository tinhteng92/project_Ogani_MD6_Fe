import { Component, OnInit } from '@angular/core';
import {CartService} from "../../service/cart/cart.service";
import {Product} from "../../model/Product";
import {OrderService} from "../../service/order/order.service";
import {CustomerService} from "../../service/customer/customer.service";
import {LoginService} from "../../service/login/login.service";
import {Customer} from "../../model/Customer";
import {Cart} from "../../model/Cart";
import {CartDetail} from "../../model/CartDetail";
import {OrderStatus} from "../../model/OrderStatus";
import {Sale} from "../../model/Sale";
import {Router} from "@angular/router";

@Component({
  selector: 'app-order-user',
  templateUrl: './order-user.component.html',
  styleUrls: ['./order-user.component.css']
})
export class OrderUserComponent implements OnInit {
  totalDiscount: number = 0;
  totalPayment: number = 0;
  addressCustomer: string = "";
  customer!: Customer;
  // cartDetail!: CartDetail;
  productList: Product[] = [];
  quantityAProduct: number[] = [];
  totalPriceAProduct: number[] = [];

  constructor(public cartService: CartService, public orderService: OrderService, private customerService: CustomerService,
  private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.customerService.findCustomerByUserName(this.loginService.getUserToken().username).subscribe((data)=>{
      this.addressCustomer = data.address;
      this.customer = data;
    })
    console.log("init " + this.cartService.productListToCart.length)
  }

  applyCoupon(priceDiscount: any) {
    this.totalDiscount = Math.round( this.cartService.totalCart * priceDiscount / 100);
    this.totalPayment = this.cartService.totalCart - this.totalDiscount;
    console.log("coupon " + this.cartService.productListToCart.length)
  }

  payment() {
    console.log("begin " + this.cartService.productListToCart.length)
    for (let i = 0; i < this.cartService.productListToCart.length; i++) {
      this.productList.push(this.cartService.productListToCart[i]);
      this.quantityAProduct.push(this.cartService.quantityAProductAfterOrder[i]);
      this.totalPriceAProduct.push(this.cartService.totalPriceAProductAfterOrder[i]);
    }

    // gọi API lưu cart
       this.orderService.saveCart(this.customer).subscribe((cart) =>{
         console.log("begin2 " + this.productList.length)
        this.cartService.cart = cart;
        console.log("carttttt" + this.cartService.cart.id);

        //gọi API lưu cartDetail
         console.log("cartDetail"+this.productList.length)
        for (let i = 0; i < this.productList.length; i++) {
          let cartDetail = {
            id: i,
            cart: cart,
            product: this.productList[i],
            seller: this.cartService.productListToCart[0].seller,
            quantity: this.quantityAProduct[i],
            totalPrice: this.totalPriceAProduct[i]
          }

          this.orderService.saveCartDetai(cartDetail).subscribe((data) =>{

          })
        }
      })


    // gọi API lưu order
    let order = {
      id: 0,
      createAt: null,
      orderStatus: {
        id:1,
        nameOrderStatus:"Wait to confirm"
      },
      priceTotal: this.totalPayment,
      customer: this.customer,
      seller: this.cartService.productListToCart[0].seller
    }

    this.orderService.saveOrder(order).subscribe((data) =>{
      console.log("orderrrr --" + data.id + "--" + data.createAt);

      // gọi API lưu orderDetail
      console.log("orderDetail" + this.productList.length)
      for (let i = 0; i < this.productList.length; i++) {
        let orderDetail = {
          id: i,
          product: this.productList[i],
          order: data,
          quantity: this.quantityAProduct[i],
          price: this.totalPriceAProduct[i]
        }

        this.orderService.saveOrderDetail(orderDetail).subscribe((newData) =>{
          console.log("orderDetaillll " + i + "--" + newData);
        })
      }
      for (let i = 0; i < this.cartService.productListToCart.length; i++) {
        this.cartService.productListToCart.pop();
      }
      console.log("pop cart" + this.cartService.productListToCart.length)
      for (let i = 0; i < this.productList.length; i++) {
        this.cartService.productListToCart.push(this.productList[i]);
      }
      console.log("pop cart 1 " + this.cartService.productListToCart.length)
    })

    this.router.navigate(["/user/thanks"]);
  }
}
