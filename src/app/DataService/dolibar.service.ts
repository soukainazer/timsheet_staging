import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DolibarService {

  constructor(private httpClient: HttpClient) { }

  private apiUrl = `https://i-team.ma/Iteam-dev/api/index.php/products`
  private  apiUrl2 = 'https://i-team.ma/Iteam-dev/api/index.php/orders/ordersbyproductid'
  private apiUrl3 = 'https://i-team.ma/Iteam-dev/api/index.php/invoices/createInvoiceFromTimesheet'
  private apiKey = '73bfd6c7ecfc9718513bd0682e24134a6f28eb1f'

  getProducts(): Observable<any>{
    const headers = new HttpHeaders({
      'DOLAPIKEY': this.apiKey
      ,
    });

    const params = {
      sortfield : 't.ref',
      sortorder : 'ASC',
      Limit : '100',
      ids_only : 'false',

    }

    return this.httpClient.get(this.apiUrl,{headers,params});
  }

  getOrdersById(productid : number): Observable<any>{
    const headers = new HttpHeaders({
      'DOLAPIKEY': this.apiKey
      ,
    });
    
    const params ={
      productid : productid,
    }

    return this.httpClient.get(this.apiUrl2,{headers,params});
  }

  incoiceTimesheet(orderId: number, productId:number, timesheetTotal : number): Observable<any>{
    const headers = new HttpHeaders({
      'DOLAPIKEY': this.apiKey
      ,
    });
    const body= {
      order_id: orderId
      ,product_id : productId
      ,timesheet_total: timesheetTotal
    }
    return this.httpClient.post(this.apiUrl3,body,{headers});
  }
}

 


