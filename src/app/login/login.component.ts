import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { error } from 'console';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  constructor(private authService: AuthService, private router: Router){}

  successMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.successMessage = localStorage.getItem('registrationMessage');
      localStorage.removeItem('registrationMessage');
    } }

  onSubmit(form: NgForm){
    if(form.valid){
      
      const { email, password } = form.value;
     
     
      this.authService.loginUser(email, password).subscribe(
        response=> {
          console.log('Login successful', response);
          

          if (response && response.role === 'ADMIN') {

            localStorage.setItem('idErp', response.idErp || '');
            console.log('Redirecting to admin-vue-globale');
            this.router.navigate(['/admin-vue-globale']);
          } else if (response && response.role === 'CONSULTANT') {
            
            if (response.idErp) {
              localStorage.setItem('idErp', response.idErp);
              this.router.navigate(['/vue-globale']);

            } else {

              console.log('idErp not available for consultant');
              this.router.navigate(['/waiting-page']);
            }
          } else {
            console.log('Unknown role, staying on the login page');
          }

          // if (response && response.idErp) {
          //   localStorage.setItem('idErp', response.idErp);
          //   if (response.role === 'ADMIN') {
          //     console.log('Redirecting to admin-vue-globale');
          //     this.router.navigate(['/admin-vue-globale']);
          //   } else if (response.role === 'CONSULTANT') {
          //     this.router.navigate(['/vue-globale']);
          //   } else {
          //     console.log('Unknown role, staying on the login page');
          //   }
          // } else {
          //   console.log('idErp not available')
          //   this.router.navigate(['/waiting-page']);
          // }
        
        },
        error=> {
          console.log('Login failed:', error)
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
        }
      )

      
    
    }

    
  }
  goToSignup(){
    this.router.navigate(['/signup']);
  }

}


//