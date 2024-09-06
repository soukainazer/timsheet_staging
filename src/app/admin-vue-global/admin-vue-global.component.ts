import { Component, NgZone} from '@angular/core';
import { FeuilleDeTempsService } from '../feuille-de-temps.service';
import { FeuilleDeTemps } from '../feuille-de-temps.service';
import { ColDef , ICellRendererParams} from 'ag-grid-community';  
import { Router } from '@angular/router';
import { UserManagementService } from '../user-management.service';
import { forkJoin } from 'rxjs';

// interface FeuilleDeTemps {
//   id: number;
//   consultantId: number;
//   year: number;
//   month: number;
//   // workedDays: string[]; 
//   totalJoursT: number;
//   workedDays: WorkedDays[];
  
// }

@Component({
  selector: 'app-admin-vue-global',
  templateUrl: './admin-vue-global.component.html',
  styleUrl: './admin-vue-global.component.css'
})
export class AdminVueGlobalComponent {
  timesheets: FeuilleDeTemps[] = [];
  gridApi: any;

  columnDefs: ColDef<any, any>[] = [
    { headerName: 'Consultant ', field: 'consultantName', sortable: true, filter: true },
    { headerName: 'Date', field: 'date', sortable: true, filter: true },
    { headerName: 'Total Jour Travaillés', field: 'totalJoursT', sortable: true, filter: true },
    { headerName: 'Statut', field: 'statut', sortable: true, filter: true },
    {headerName: 'Actions', 
      cellRenderer: (params : ICellRendererParams) => {
        const button = document.createElement('button');
        button.innerText = 'View';
        button.classList.add('btn', 'btn-primary');
        button.addEventListener('click', () => this.onViewClick(params.data.id));
        return button;
      }}
  ];

  defaultColDef: ColDef<FeuilleDeTemps, any> = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,  
    filter: true    
  };

  constructor(  private router: Router,
      private feuilleDeTempsService: FeuilleDeTempsService,
      private ngZone: NgZone,
      private userManagementService: UserManagementService
  ) { }

  ngOnInit(): void {
    this.loadTimesheets();
  }


  loadTimesheets(): void {
    this.feuilleDeTempsService.getAllTimesheets().subscribe(
      (data: any[]) => {
        console.log('Timesheets data:', data);
        const filteredData = data.filter(timesheet => {
          const workedDaysArray = timesheet.jourtravaille && timesheet.jourtravaille[0]?.workedDays;
          console.log('workedDays:', workedDaysArray); 
          return workedDaysArray && workedDaysArray.length > 0;
        });        
        const consultantRequest = data.map(timesheet => 
          this.userManagementService.getConsultantById(timesheet.consultantId)
        );

        forkJoin(consultantRequest).subscribe(consultants =>{
          const newTimesheets = filteredData.map((timesheet, index)=>({
            ...timesheet,
          
            consultantName:` ${consultants[index]?.nom} ${consultants[index]?.prenom}`,
            date: `${timesheet.year} / ${timesheet.month}`,
            statut: `${timesheet.statut}`

          })
          
          )
          this.timesheets = [...newTimesheets];

          if (this.gridApi) {
            this.gridApi.setRowData(this.timesheets);
            this.gridApi.ensureIndexVisible(0); 
          }
        });
        

      },
      (error) => {
        console.error('Error fetching timesheets', error);
      }
    );
  }

  onViewClick(id: number): void {
    this.ngZone.run(() => {
      this.router.navigate(['/admin/timesheet', id]);
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setRowData(this.timesheets); 
  }
}


