import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vue-generale',
  templateUrl: './vue-generale.component.html',
  styleUrl: './vue-generale.component.css'
})
export class VueGeneraleComponent implements OnInit {
  months: { date: string, showButton: boolean}[] = [];
  currentYear: number = new Date().getFullYear();
  consultantId = localStorage.getItem('consultantId');
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateMonths();
  }

  // generateMonths(): void {
    
  //   const currentMonth = new Date().getMonth() + 1;

  //   for (let i = 1; i <= 12; i++) {
  //     const month = i < 10 ? `0${i}` : i;
  //     this.months.push({
  //       date: `${this.currentYear}/${month}`,
  //       showButton: i <= currentMonth, 
  //     });
  //   }
  // }

  generateMonths(): void {
    const currentMonth = new Date().getMonth() + 1; // Get the current month (1-based index)
  
    this.months = []; // Reset the months array
  
    for (let i = 1; i <= 12; i++) {
      const month = i < 10 ? `0${i}` : `${i}`; // Format month as two digits
      const date = `${month}`; // Format date as YYYY-MM
      this.months.push({
        date: date,
        showButton: i <= currentMonth, // Show button only for months up to the current month
      });
    }
  }
  
  

  goToTimesheet(month: string): void {
    const consultantId = localStorage.getItem('consultantId');
    const year = new Date().getFullYear();
    if (consultantId) {
      // Ensure month is formatted as 'MM' and year as 'YYYY'
      const formattedMonth = month.padStart(2, '0'); // Ensure month is two digits
      const formattedYear = year.toString(); // Ensure year is four digits
  
      this.router.navigate([`/timesheet`, consultantId, formattedYear, formattedMonth]);
    } else {
      console.error('Consultant ID is not available in local storage');
    }
  }


}
