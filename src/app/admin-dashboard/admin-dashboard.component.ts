import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { UserManagementService } from '../user-management.service';
import { DolibarService } from '../DataService/dolibar.service';

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
  erpId?: string; 
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  consultants: Consultant[] = [];
  products : any[]= [];

  constructor(
    private userManagementService: UserManagementService,
    private router: Router,
    private doliService : DolibarService
  ) { }

  ngOnInit(): void {
    this.userManagementService.getConsultants().subscribe(data => {
      this.consultants = data;
    });

    this.doliService.getProducts().subscribe( data => {
      this.products = data;
      console.log(this.products);
    }

    )

  }

  // viewConsultantDetails(id: number): void {
  //   this.router.navigate(['/consultant', id]);
  // }

  viewConsultantDetails(id: number) {
    if (id) {
      this.router.navigate(['/consultant', id]);
    } else {
      console.error('Consultant ID is undefined or null');
    }
  }

}