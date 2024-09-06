import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8090/auth';

  constructor(private http: HttpClient,private router: Router) { }

    registerConsultant(userData: any): Observable<any> {
      return this.http.post(this.apiUrl+'/register-consultant', userData);
    }
  
    loginUser(email: string, password: string): Observable<any> {
      return this.http.post<any>(this.apiUrl + '/login', { email, motDePasse: password }).pipe(
        tap(response => {
          if (response && response.accessToken) {
            this.saveToken(response.accessToken);
            localStorage.setItem('UserEmail', response.email);
            localStorage.setItem('role', response.role);  
           
       
            if (response.role === 'ADMIN') {
              this.router.navigate(['/admin-vue-globale']);
            } else if (response.role === 'CONSULTANT') {
              localStorage.setItem('consultantId', response.consultantId.toString());
              this.router.navigate(['/vue-globale']);
            }
        
            
          }
        })
      );
    }
    
    

    saveToken(token: string): void {
      localStorage.setItem('accessToken', token);
      console.log('Token saved:', token);
    }

    getToken(): string | null {
      return localStorage.getItem('accessToken');
    }
    getDecodedToken(): any {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          return jwtDecode(token);
        } catch (error) {
          console.error('Error decoding token', error);
        }
      }
      return null;
    }

    logout(): void {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('UserEmail'); 
      localStorage.removeItem('userRole'); 
      localStorage.removeItem('role');
      localStorage.removeItem('idErp');
      localStorage.removeItem('consultantId');

      this.router.navigate(['/login']);
    }
    

    isAuthenticated(): boolean {
      const token = localStorage.getItem('accessToken');
      // Validate the token here (e.g., check expiration, etc.)
      return !!token; // Return true if a token exists, false otherwise
    }
}
