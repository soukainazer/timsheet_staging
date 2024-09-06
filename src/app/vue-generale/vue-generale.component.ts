import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeuilleDeTempsService } from '../feuille-de-temps.service';
import { response } from 'express';

@Component({
  selector: 'app-vue-generale',
  templateUrl: './vue-generale.component.html',
  styleUrl: './vue-generale.component.css'
})
export class VueGeneraleComponent implements OnInit {
  months: { date: string, showButton: boolean, statut: string}[] = [];
  currentYear: number = new Date().getFullYear();
  consultantId = localStorage.getItem('consultantId') ;
  timesheet:any;
  formattedMonth:string='';
  formattedYear: string='';
  btnPending:any;
  btnvalide:any;
  btnRejected:any;
 
  
  constructor(private router: Router,
              private feuilleDeTempsService: FeuilleDeTempsService
  ) {}

  ngOnInit(): void {
    this.consultantId = localStorage.getItem('consultantId');
    if (this.consultantId) {
      const consultantIdNumber = parseInt(this.consultantId, 10); // Convert to number
      if (!isNaN(consultantIdNumber)) {
        this.generateMonths(consultantIdNumber);
      } else {
        console.error('Invalid consultant ID');
      }
    } else {
      console.error('Consultant ID not found in local storage');
    }
  }

 

  generateMonths(consultantIdNumber: number): void {
    const currentMonth = new Date().getMonth() + 1; 
  
    this.months = [];
  
    for (let i = 1; i <= 12; i++) {
      const month = i < 10 ? `0${i}` : `${i}`; 
      const date = `${month}`;
      const year = this.currentYear.toString();
     
      this.feuilleDeTempsService.getTimeSheet(consultantIdNumber, +month, +year).subscribe(
        (response: any) => {
        const statut = response.statut; 
        console.log('statut',response.statut)

        this.months.push({
          date: date,
          showButton: i <= currentMonth, 
          statut: statut
        });
        
      },
      
      error => {
        console.error('Error fetching timesheet:', error);
        this.months.push({
          date: date,
          showButton: i <= currentMonth,
          statut: 'pending' 
        });
      }
    ); 
    }
  }
  
  timesheetButton(){
    this.timesheet.feuilleDeTempsService.getTimeSheet(this.consultantId,this.formattedMonth,this.formattedYear).subscribe((response:any)=>{
      this.timesheet= response;

    })
  }

  goToTimesheet(month: string): void {
    const consultantId = localStorage.getItem('consultantId');
    this.currentYear = new Date().getFullYear();
    if (consultantId) {
      this.formattedMonth = month.padStart(2, '0'); 
      this.formattedYear = this.currentYear.toString(); 
  
      

      this.router.navigate([`/timesheet`, consultantId, this.formattedYear, this.formattedMonth]);
    } else {
      console.error('Consultant ID is not available in local storage');
    }
  }
  getButtonClass(statut: string): string {
    switch (statut) {
      case 'valider':
        return 'btn-green';
      case 'rejeter':
        return 'btn-red';
      default:
        return 'btn-yellow'; 
    }  }

}
