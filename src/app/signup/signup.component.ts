import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  constructor(private authService : AuthService, private router: Router ) {}


  step = 1;
  formData = {
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    email: '',
    nationalite: '',
    sexe: '',
    dateNaissance: '',
    situationFamiliale: '',
    lieuResidence: '',
    service: '',
    fonction: '',
    coordonnees: '',
    motDePasse: '',
    confirmPassword:'',
    role: 'CONSULTANT'
  };

  onSubmit(form: NgForm) {
    if (form.valid) { 
      
      this.authService.registerConsultant(this.formData).subscribe(
        response => {
          console.log('Formulaire' , this.formData);
          console.log('User registered successfully:', response);
          localStorage.setItem('registrationMessage', 'Registration successful. Please log in.');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Registration error:', error);
        }
      );
      
    }
  }

  
  next() {
    if (this.step === 1 && this.isFirstStepValid()){
    this.step = 2;
    }
  }

  isFirstStepValid(): boolean {
    return this.formData.motDePasse === this.formData.confirmPassword &&
           this.formData.motDePasse.trim() !== '' &&
           this.formData.confirmPassword.trim() !== '';
          }


  //get(){
  //  this.timesheet
  //}
  previous() {
    if (this.step === 2) {
    this.step = 1;
    }
  }

}
