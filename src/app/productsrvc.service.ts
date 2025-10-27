import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class Productsrvc {
  private baseUrl = 'https://ecommerce-cc76b-default-rtdb.asia-southeast1.firebasedatabase.app/';
  constructor(public httpsrvc:HttpClient){}
  getAllCategories(){
    return this.httpsrvc.get(`${this.baseUrl}/categories.json`);
  }
  getAllProducts(){
    return this.httpsrvc.get(`${this.baseUrl}/products.json`);
  }
  getProduct(id:any){
    const pid=id-1;
    return this.httpsrvc.get(`${this.baseUrl}/products/${pid}.json`);
  }
  getAllProductsByCategory(catid:any){
    const url="http://localhost:3000/products/?catid="+catid;
    return this.httpsrvc.get(url);
  }
}