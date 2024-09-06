import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface WorkedDays {
  workedDays: { date: string; bonDeCommandeId: string }[];
}

export interface FeuilleDeTemps {
  id: number;
  consultantId: number;
  year: number;
  month: number;
  workedDays: string[]; 
  totalJoursT: number;
  bonsDeCommande : BonDeCommande[];
 
}
interface BonDeCommande {
  order_id: string;
  order_ref: string;
  date_commande: string | null;
  total_ht: string;
  nombre_of_days: string;
  nombre_de_jour_consomes: string;
  nombre_de_jour_restants: string;
}



@Injectable({
  providedIn: 'root'
})
export class FeuilleDeTempsService {

  private apiUrl = `http://localhost:8090/feuilledetemps`;
  
  constructor(private http: HttpClient) { }

  addBulkTimesheet(consultantId: number, year: number, month: number , workedDays : any[], base64File : string | null): Observable<void> {
    const formData = new FormData();
    formData.append('consultantId', consultantId.toString());
    formData.append('year', year.toString());
    formData.append('month', month.toString());
    formData.append('workedDaysJson', JSON.stringify(workedDays)); 
    if (base64File) {
      formData.append('pieceJointe', base64File);
    }

    return this.http.post<void>(`${this.apiUrl}/add`, formData);
  }

  updateTimesheet(consultantId: number, year: number, month: number, timesheet:any[]){
    return this.http.put<void>(`${this.apiUrl}/update`, timesheet);
  }

 
 
  getTimeSheet(consultantId: number, year: number, month: number): Observable<any> {
    return this.http.get<FeuilleDeTemps>(`${this.apiUrl}/${consultantId}/${year}/${month}`);
  }

  getAllTimesheets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/timesheets`);
  }

  getTimesheetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/timesheet/${id}`);
  }

  validateTimesheet(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/valider`, {statut: 'valider'});
  }

  rejectTimesheet(id: number, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/rejeter`, {reason});
  }

}

 

  // addBulkTimesheet(consultantId: number, year: number, month: number , workedDays : any[]): Observable<void> {
  //   const params = new HttpParams()
  //     .set('consultantId', consultantId.toString())
  //     .set('year', year.toString())
  //     .set('month', month.toString())
      

  //   return this.http.post<void>(`${this.apiUrl}/add`, workedDays , { params });
  // }