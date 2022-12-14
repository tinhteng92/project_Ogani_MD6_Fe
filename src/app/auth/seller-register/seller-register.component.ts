import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../service/login/login.service";
import {Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {finalize, Observable} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-seller-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.css']
})
export class SellerRegisterComponent implements OnInit {
  title = "cloudsSorage";
  avatar: string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8czzbrLzXJ9R_uhKyMiwj1iGxKhJtH7pwlQ&usqp=CAU";
  downloadURL: Observable<string> | undefined;
  onFileSelected(event: Event) {
    var n = Date.now();
    // @ts-ignore
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.avatar = url;
            }
            console.log(this.avatar);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  imageBanner: string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8czzbrLzXJ9R_uhKyMiwj1iGxKhJtH7pwlQ&usqp=CAU";
  downloadURLBanner: Observable<string> | undefined;
  onFileSelectedBanner(event: Event) {
    var n = Date.now();
    // @ts-ignore
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURLBanner = fileRef.getDownloadURL();
          this.downloadURLBanner.subscribe(url => {
            if (url) {
              this.imageBanner = url;
            }
            console.log(this.imageBanner);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }


  check: boolean = false;
  constructor(private loginService: LoginService, private router: Router,private storage: AngularFireStorage) {
  }

  ngOnInit(): void {
  }

  registerSellerForm = new FormGroup({
    name: new FormControl("", Validators.required),
    phoneNumber: new FormControl("", [Validators.required, Validators.pattern("^0[0-9]{9}$")]),
    avatar: new FormControl(""),
    imageBanner: new FormControl(""),
    address: new FormControl("", Validators.required),
    isAccept: new FormControl(false),
    isActive: new FormControl(true),
    appUser: new FormGroup({
      username: new FormControl("", [Validators.required, Validators.email, Validators.maxLength(50)]),
      password: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      roles: new FormArray([new FormGroup({
        id: new FormControl("2")
      })])
    })

  })

  registerSeller() {
    if (this.registerSellerForm.valid) {
      this.loginService.checkUserName(this.registerSellerForm.value.appUser?.username).subscribe((data) => {
        console.log("data-username" + data);
        if (data) {
          this.registerSellerForm.get("avatar")?.setValue(this.avatar);
          this.registerSellerForm.get("imageBanner")?.setValue(this.imageBanner);
          this.loginService.registerSeller(this.registerSellerForm.value).subscribe((data) => {
            console.log("data");
            console.log(data);
            this.router.navigate(["/login"]);
          })
        } else {
          this.check = true;
          this.router.navigate(["/register-seller"]);
        }
      })

    } else {
      alert("Please checkout form!");
      this.router.navigate(["/register-seller"]);
    }

  }


}
