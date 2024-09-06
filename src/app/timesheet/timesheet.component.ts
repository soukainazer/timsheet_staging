 import {AfterViewInit,  Component, OnInit } from '@angular/core';
 import { ActivatedRoute, Router } from '@angular/router';
 import { ColDef, GridOptions ,GridApi , Column } from 'ag-grid-community';
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
      this.year = params.get('year') ? parseInt(params.get('year')!, 10) : null;
      this.month = params.get('month') ? parseInt(params.get('month')!, 10) : null;

      if (this.consultantId && this.year && this.month) {
        // this.getBonDeCommande();
        // this.initializeGrid();

        // this.loadFeuilleDeTemps();
        this.initializeGrid();
      
        // this.loadFeuilleDeTempsData();
        
      } else {
        console.error('Missing route parameters');
      }
    });
    // this.calculateTotalDays();
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
        { headerName: 'Total', field: 'total', valueGetter: this.calculateRowTotal.bind(this) }
      ];
      console.log('before load')
      this.getBonDeCommande();
      //  this.loadFeuilleDeTemps();
      
       
      
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


  // updateGridWithBCs(): void {
  //   this.rowData = this.bonsDeCommande.map(bc => ({
  //     ...bc,
  //     ...this.createEmptyRowData()
  //   }));
    
  //   if (this.gridApi) {
  //     this.gridApi.applyTransaction({ add: this.rowData });
  //     this.calculateTotalDays(); 
  //   }
  // }

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
      // console.log(`Day ${i}: ${dayName}`);
      columns.push({
        headerName: `${dayName} ${i}`,
        field: `day${i}`,
        editable: true,
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
      

  


onFileChange(event: any): void {
  this.selectedFile = event.target.files[0];
  const reader = new FileReader();

  reader.onloadend= () => {
    this.base64File = reader.result as string;
    
    console.log('base64 string:',this.base64File)
  };
  if (this.selectedFile){
    reader.readAsDataURL(this.selectedFile);
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
    
    this.feuilleDeTempsService.addBulkTimesheet(+this.consultantId, +year, +month, workedDays,this.base64File)
      .subscribe(() => {
        console.log('Timesheet successfully updated.');
        this.showSuccessMessage('La Feuille de Temps successfully updated.')
        console.log('File' , this.selectedFile);
        this.router.navigate(['vue-globale']);
      }, error => {
        console.error('Error updating timesheet:', error);
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




  // loadFeuilleDeTemps(): void {
    
  //   if (this.consultantId && this.year !== null && this.month !== null) {
  //     this.feuilleDeTempsService.getTimeSheet(+this.consultantId, +this.year, +this.month).subscribe(
  //       data => {
  //         console.log('Loaded timesheet data:', data);
  //         // this.initializeGrid();
  //         // this.getBonDeCommande();
  //         if (data.bonsDeCommande) {
  //           this.bonsDeCommande = data.bonsDeCommande;
  //           this.rowData = data.bonsDeCommande.map((bc:any) => ({
  //             bcId: bc.order_ref ,
  //             ...this.createEmptyRowData() 
  //           }));
  //           this.gridApi.applyTransaction({ add: this.rowData });

  //         } else {
  //           console.warn('bonsDeCommande property is missing in the response');
  //         }
  //         this.totalDaysWorked = data.totalJoursT || 0;
  //         this.bonsDeCommande = data.bonsDeCommande || [];
  //       },
  //       error => {
  //         console.error('Error loading timesheet:', error);
  //       }
  //     );
  //   }
  // }

  loadFeuilleDeTemps(): void {
    if (this.consultantId && this.year && this.month) {
      this.feuilleDeTempsService.getTimeSheet(+this.consultantId, +this.year, +this.month)
        .subscribe(
          (response: any) => {
            console.log('timesheet',response);
            this.rowData = this.bonsDeCommande.map(bc => ({
              ...bc,
              ...this.createDaysColumnsData()  
            }));
            if (response.jourtravaille && response.jourtravaille.length > 0) {
            response.jourtravaille.forEach((workedDayEntry:any) => {
              workedDayEntry.workedDays.forEach((workedDay:any) => {

                const bcId = workedDay.bonDeCommandeId;
                const date = new Date(workedDay.date);
                const dayNumber = date.getDate();
                const duration = workedDay.duration;
                
                console.log('rowdata',this.rowData);
                const matchingRow = this.rowData.find(row => row.order_id === bcId.toString(),);
                
                
  
          
            if (matchingRow) {
              matchingRow[`day${dayNumber}`] = duration;
            }
          });
        });
      }
  
            if (this.gridApi) {
              this.gridApi.applyTransaction({ add: this.rowData });  
            }
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

