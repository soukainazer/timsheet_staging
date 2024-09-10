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
  private apiUrl4 = 'https://i-team.ma/Iteam-dev/api/index.php/documents/upload'
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

  uploadFile( ref: string, base64FileContent: string , filename: string) :Observable<any>{
    const headers = new HttpHeaders({
      'DOLAPIKEY': this.apiKey
      ,
    });
  //   const formData = new FormData();
  //   formData.append("filename" ,file.name);
  //   formData.append("modulepart", "facture");
  //   formData.append("ref",ref);

  //  formData.append("filecontent",file);
  //  formData.append("fileencoding", "base64");

  const body= {
    filename: filename,
    modulepart: "facture",
    ref:ref,
    filecontent: base64FileContent,
    fileencoding: "base64",
    overwriteifexists:0,
    createdirifnotexists:1,
    

  }

   return this.httpClient.post(this.apiUrl4,body,{headers})

  }

  createInvoiceFile(orderId: number, productId:number, timesheetTotal : number, base64FileContent:string, filename:string): Observable<any>{

    return new Observable((observer)=>
    {
      this.incoiceTimesheet(orderId,productId,timesheetTotal).subscribe((responce)=>
      {
        const idRef =  responce  ;
        this.uploadFile(idRef,base64FileContent, filename).subscribe((data)=>
        {
          observer.next({ responce,data});
          observer.complete();
        }
        )
        }
      )
    }
    )
  }
}

 


