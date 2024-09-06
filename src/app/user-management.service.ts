import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface Consultant {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  adresse: string;
  nationalite: string;
  sexe: string;
  dateNaissance: string;
  situationFamiliale: string;
  lieuResidence: string;
  service: string;
  fonction: string;
  
  idErp?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {


  private apiUrl = 'http://localhost:8090/consultant'; 

  constructor(private http: HttpClient) { }

  getConsultants(): Observable<Consultant[]> {
    return this.http.get<Consultant[]>(`${this.apiUrl}`);
  }

  getConsultantById(id: number): Observable<Consultant> {
    return this.http.get<Consultant>(`${this.apiUrl}/${id}`);
  }


  updateIdErp(id: number , idErp: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/idErp`, idErp 
    );
  }

}
