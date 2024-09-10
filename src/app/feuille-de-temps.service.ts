import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { blob } from 'stream/consumers';


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

  addBulkTimesheet(consultantId: number, year: number, month: number , workedDays : any[],filesWithBcId:  { bcId: string, file: File }[]): Observable<void> {
    const formData = new FormData();
    formData.append('consultantId', consultantId.toString());
    formData.append('year', year.toString());
    formData.append('month', month.toString());
    formData.append('workedDaysJson', JSON.stringify(workedDays)); 

   filesWithBcId.forEach(({ bcId, file }) => {
    formData.append(`pieceJointe_${bcId}`, file, file.name);
    console.log(`Base64 File for BC ${bcId}:`, file, file.name);
  });
    

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

  rejectTimesheet(timesheetId: number, reason: string): Observable<void> {
    const notification = { message: reason };
    return this.http.put<void>(`${this.apiUrl}/${timesheetId}/rejeter`, notification);
}

  getNotificationsForConsultant(consultantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${consultantId}/notification`);
  }

  getNotificationsByTimesheetId(timesheetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notification/${timesheetId}`);
  }

}

 

  // addBulkTimesheet(consultantId: number, year: number, month: number , workedDays : any[]): Observable<void> {
  //   const params = new HttpParams()
  //     .set('consultantId', consultantId.toString())
  //     .set('year', year.toString())
  //     .set('month', month.toString())
      

  //   return this.http.post<void>(`${this.apiUrl}/add`, workedDays , { params });
  // }