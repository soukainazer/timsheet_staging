 import {AfterViewInit,  Component, OnInit } from '@angular/core';
 import { ActivatedRoute, Router } from '@angular/router';
 import { ColDef,CellClassParams, GridOptions ,GridApi , Column } from 'ag-grid-community';
 import { FeuilleDeTempsService } from '../feuille-de-temps.service';
 import { isPlatformBrowser } from '@angular/common';
 import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { AddBonDeCommandeComponent } from '../add-bon-de-commande/add-bon-de-commande.component';
import { MatDialog } from '@angular/material/dialog'; 
import { DolibarService } from '../DataService/dolibar.service';
import { ErrorHandlerService } from '../error-handler.service';
import { __param } from 'tslib';
import { MatSnackBar } from '@angular/material/snack-bar';

 interface FeuilleDeTemps {
  id: number;
  consultantId: number;
  year: number;
  month: number;
  workedDays: string[]; // "YYYY-MM-DD" 
  bonsDeCommande: BonDeCommande[];
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
interface WorkedDays {
  workedDays: { date: string; bonDeCommandeId: string }[];
  
}


 @Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit,AfterViewInit{
  private gridApi!: GridApi ;
  // private columnApi!: ColumnApi;
 
  consultantId: string | null = null;
  consultantIdErp: string | null = null;
  month: number | null = null;
  year: number | null = null;
  gridOptions: any;
  columnDefs: ColDef[]= [];
  rowData: any[] = [];
  totalDaysWorked: number = 0;
  bonsDeCommande: BonDeCommande[] = [];
  selectedFile: File | null = null;
  base64File: string | null = null; 
  notifications: any;

  constructor(
    private route: ActivatedRoute,
    private feuilleDeTempsService: FeuilleDeTempsService,
    private dialog: MatDialog ,
    private dolibarService: DolibarService,
    private errorHandler: ErrorHandlerService,
    private router : Router,
    private snackBar: MatSnackBar
  ) {
  

    this.gridOptions = {
      defaultColDef: {
        flex: 2,
        minWidth: 150,
        filter: true,
        sortable: true,
        resizable: true
      },
      onCellValueChanged: this.calculateTotalDays.bind(this),
      onGridReady: (params: any) => {
        this.gridApi = params.api;
        
         params.api.sizeColumnsToFit();
      }
    };
  }

  ngAfterViewInit(): void {
    if (this.gridApi) {
      console.log('Grid API is available');
    } else {
      console.error('Grid API is not available');
    }
    
  }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      this.consultantId = params.get('consultantId');
      const conId= params.get('consultantId') ? parseInt(params.get('consultantId')!, 10) : null;
      this.year = params.get('year') ? parseInt(params.get('year')!, 10) : null;
      this.month = params.get('month') ? parseInt(params.get('month')!, 10) : null;
      const timesheetId = params.get('timesheetId');  

      if (this.consultantId && this.year && this.month) {
        
        this.initializeGrid();
        
        this.feuilleDeTempsService.getTimeSheet(+this.consultantId, this.year, this.month).subscribe(
          (timesheets: any[]) => {
            const rejectedTimesheets = timesheets.filter(timesheet => timesheet.statut === 'rejeter');
        
            if (rejectedTimesheets.length > 0) {
              const timesheetId = rejectedTimesheets[0].id;  
              console.log('Rejected timesheet id:', timesheetId);
              
              if (timesheetId) {
                this.feuilleDeTempsService.getNotificationsByTimesheetId(+timesheetId).subscribe(
                  notifications => {
                    console.log("timesheetId", timesheetId);
                    this.notifications = notifications;
                    console.log("notification", this.notifications);
                  },
                  error => {
                    console.error('Error fetching notifications', error);
                  }
                );
              } else {
                console.log('Timesheet ID is null or undefined.');
              }
            } else {
              console.log('No rejected timesheets found.');
            }
          },
          error => {
            console.error('Error fetching timesheets', error);
          }
        );
        
  
      } else {
        console.error('Missing route parameters');
      }
    });
    
  }


  
  initializeGrid(): void {

    
    if (this.year !== null && this.month !== null) {
      this.columnDefs = [
        { headerName: 'id', field: 'order_id', editable: true, pinned: 'left' ,maxWidth:80},
        { headerName: 'Order Ref', field: 'order_ref' , pinned: 'left'},
        // { headerName: 'Date Commande', field: 'date_commande' },
        // { headerName: 'Total HT', field: 'total_ht' },
        // { headerName: 'Number of Days', field: 'nomber_of_days' },
        { headerName: 'Days Consumed', field: 'nomber_de_jour_consumes', pinned: 'left' },
        { headerName: 'Days Remaining', field: 'nombre_de_jour_restants' , pinned: 'left'},
       
        ...this.generateDayColumns(),
        { headerName: 'Total', field: 'total', valueGetter: this.calculateRowTotal.bind(this) },
        
        {
          headerName: 'Upload',
          field: 'upload',
          cellRenderer: (params: any) => {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
        
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/pdf';
            input.style.display = 'none'; 
            input.className = 'upload-input'; 
        
            const button = document.createElement('button');
            button.className = 'upload-button'; 
            button.innerHTML = '+';

            const fileNameDisplay = document.createElement('span');
            fileNameDisplay.style.marginLeft = '10px';
            fileNameDisplay.style.color = '#333'; // Dark text color
            fileNameDisplay.style.fontSize = '14px';
            fileNameDisplay.style.whiteSpace = 'nowrap';
        
            wrapper.appendChild(button);
            wrapper.appendChild(fileNameDisplay);
            wrapper.appendChild(input);
        
            button.addEventListener('click', () => {
              input.click();
            });
        
            input.addEventListener('change', (event: Event) => {
              const fileInput = event.target as HTMLInputElement;
              if (fileInput.files && fileInput.files.length > 0) {
                // Show the name of the selected file
                fileNameDisplay.textContent = fileInput.files[0].name;
                // You can also handle the file upload here if needed
                this.onFileChange(event, params.data['order_id']);
              } else {
                fileNameDisplay.textContent = 'No file chosen'; // Optional: Message when no file is selected
              }
            });
                
            return wrapper;
          },
          pinned: 'left',
          maxWidth: 150
        }
        
      ];
      this.getBonDeCommande();
      
      
       
      
    }
  }

  
 


  calculateRowTotal(params: any): number {
    const row = params.data;
    const total = Object.keys(row)
      .filter(key => key.startsWith('day'))
      .reduce((sum, key) => {
        const value = row[key];
        return sum + (typeof value === 'number' ? value : 0);
      }, 0);
    
    return total;
  }

  getBonDeCommande(): void {
    const idErpString = localStorage.getItem('idErp');
    console.log('idErp', idErpString);
    const idErp = Number(idErpString);
    console.log('idErp',idErp);

   
   this.dolibarService.getOrdersById(idErp).subscribe(
    (response: { success: boolean; data: BonDeCommande[]}) => {
     
      if(response.success){
        this.bonsDeCommande = response.data;
      

      console.log('Orders by id data', this.bonsDeCommande);
      // this.updateGridWithBCs();
      this.loadFeuilleDeTemps();
      } else{
        console.log('Failed to fetch orders');
      }
    },
    error => {
      this.errorHandler.handleError(error);
    }
   );
 
  }



  createDaysColumnsData(): any {
    const daysInMonth = new Date(this.year!, this.month!, 0).getDate();
    const dayColumnsData: any = {};
  
    for (let i = 1; i <= daysInMonth; i++) {
      dayColumnsData[`day${i}`] = 0; // Initialize to 0 
    }
    
    return dayColumnsData;
  }

  

  createEmptyRowData(): { [key: string]: any } {
    const newRow: { [key: string]: any } = { bcId: '' };
    this.columnDefs.forEach(col => {
      if (col.field && col.field.startsWith('day')) {
        newRow[col.field] = 0;
      }
    });
    
    return newRow;
  }
  




  generateDayColumns(): ColDef[] {

    const daysInMonth = new Date(this.year!, this.month!, 0).getDate();
    const columns: ColDef[] = [];
    console.log(`Generating columns for ${daysInMonth} days in month ${this.month} of year ${this.year}`);


    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.year!,this.month! - 1, i);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const isWeekend = date.getDay() === 0 || date.getDay() === 6; // 0 = Sunday, 6 = Saturday


      columns.push({
        headerName: `${dayName} ${i}`,
        field: `day${i}`,
        editable:  !isWeekend,
        cellClassRules: {
          'weekend-cell': (params: CellClassParams<any, any>) => isWeekend 
        },
        cellEditor: 'agNumericCellEditor',
        valueSetter: (params)=> {
          if (!params.colDef || !params.colDef.field) {
            return false;
        }
          let value = params.newValue;
          if (value < 0) value= 0;
          if (value > 1) value= 1;
          params.data[params.colDef.field]= value;
          return true;
        }
      });
    }
    return columns;
  }



  onAddBonDeCommande(): void {
   
  
        const newRow = this.createEmptyRowData();
        newRow['bcId'] = '';  
  
        // this.bonsDeCommande.push(selectedBonDeCommande);
        this.rowData.push(newRow);
  
        if (this.gridApi) {
          this.gridApi.applyTransaction({ add: [newRow] });
          this.gridApi.refreshCells({ force: true });
        }
        
        this.calculateTotalDays();
  }
    
  
  calculateTotalDays(): number {
        this.totalDaysWorked = this.rowData.reduce((total: number, row: any) => {
          return total + Object.keys(row)
            .filter(key => key.startsWith('day'))
            .reduce((sum: number, key: string) => sum + (typeof row[key] === 'number' ? row[key] : 0), 0);
        }, 0);
      
        return this.totalDaysWorked;
  }
      




onFileChange(event: Event, orderId: string): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  console.log('onFileChange called with rowIndex:', orderId);

  if (file) {
    // Find the row by rowIndex
    const row = this.rowData.find(r => r['order_id'] === orderId);
    

    if (row) {
      row['file'] = file; // Store the file in the row data
      console.log(`File successfully added for order_id: ${orderId}`);
    } else {
      console.error(`Row with order_id ${orderId} does not exist.`);
    }
  }
}


onSubmitTimesheet(): void {
  if (this.consultantId && this.year !== null && this.month !== null ) {

    const year = Number(this.year);
    const month = Number(this.month)  ;
    const workedDays= this.extractWorkedDays();

    console.log('workedDays',this.extractWorkedDays);
   

    if (workedDays.length === 0) {
      console.error('Worked days cannot be empty.');
      return;
    }

    const filesWithBcId = this.rowData.map((row, index) => {
      const bcId = row['order_id'];
      const file = row['file'] as File;
      if (file) {
        return { bcId, file };
      }
      return null;
    }).filter(item => item !== null) as { bcId: string, file: File }[];

    console.log('filesWithBcId', filesWithBcId);

    this.feuilleDeTempsService.addBulkTimesheet(+this.consultantId, +year, +month, workedDays,filesWithBcId)
      .subscribe(() => {

        this.snackBar.open('Timesheet submitted successfully!', 'Close', { duration: 3000 });
        this.showSuccessMessage('La Feuille de Temps successfully updated.')
        this.router.navigate(['vue-globale']);

      }, error => {
        console.error('Error updating timesheet:', error);
        this.snackBar.open('Missing required data!', 'Close', { duration: 3000 });

      });
  } else {
    console.error('Consultant ID, year, or month is not available.');
  }
}



extractWorkedDays(): any[] {
  const workedDaysArray: any[] = [];

  this.rowData.forEach(row => {
    const bonDeCommandeId = row['order_id']; 

    Object.keys(row).forEach(key => {
      if (key.startsWith('day') && row[key] !== 0) {
        const dayIndex = parseInt(key.replace('day', ''), 10);
        const day = dayIndex.toString().padStart(2, '0');
        const month = this.month!.toString().padStart(2, '0');
        const workedDay = `${this.year}-${month}-${day}`;

        workedDaysArray.push({ date: workedDay,
           bonDeCommandeId,
          duration: row[key]
          });
      }
    });
  });

  return workedDaysArray; 
}




loadFeuilleDeTemps(): void {
 
  if (this.consultantId && this.year && this.month) {
    
    this.feuilleDeTempsService.getTimeSheet(+this.consultantId, +this.year, +this.month)
      .subscribe(
        (response: any[]) => {
          this.rowData = this.bonsDeCommande.map(bc => ({
            ...bc,
            ...this.createDaysColumnsData()  
          }));

          response.forEach((timesheet: any) => {
            timesheet.jourtravaille.forEach((jourtravaille: any) => {
              jourtravaille.workedDays.forEach((workedDay: any) => {
                const bcId = workedDay.bonDeCommandeId;
                const date = new Date(workedDay.date);
                const dayNumber = date.getDate();
                const duration = workedDay.duration;

                const row = this.rowData.find(r => +r.order_id === bcId);


                if (row) {
                  // Update the row with worked day data
                  row[`day${dayNumber}`] = (row[`day${dayNumber}`] || 0) + duration;
                }
              });
            });
          });

         

          // Apply the updated data to the grid
          if (this.gridApi) {
            this.gridApi.applyTransaction({ add: this.rowData });           }
          this.calculateTotalDays();
        },
        error => {
          this.errorHandler.handleError(error);
        }
      );
  }
}





  parseFeuilleDeTemps(data: FeuilleDeTemps): any[] {
    const daysInMonth = new Date(this.year!, this.month! - 1, 0).getDate();
    
    
    const rowData = [{
      bcId: '',
      ...Array.from({ length: daysInMonth }, (_, i) => {
        
        const dayDate = new Date(this.year!, this.month! - 1, i + 1);
        const formattedDate = format(dayDate, 'yyyy-MM-dd');
  
        console.log(`Checking date ${formattedDate} in workedDays`, data.workedDays.includes(formattedDate));

      return {
        [`day${i + 1}`]: data.workedDays.includes(formattedDate) ? 1 : 0
      };
    }).reduce((acc, cur) => ({ ...acc, ...cur }), {})
  }];
  
    return rowData;
  }
  

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,  
      verticalPosition: 'top',  
      horizontalPosition: 'center'  
    });}



  
}

