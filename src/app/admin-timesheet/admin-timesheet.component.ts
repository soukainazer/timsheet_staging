import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridOptions, GridApi } from 'ag-grid-community';
import { FeuilleDeTempsService } from '../feuille-de-temps.service';
import { format } from 'date-fns';
import { MatTableDataSource } from '@angular/material/table';
import { DolibarService } from '../DataService/dolibar.service';
import { error } from 'console';
import { UserManagementService } from '../user-management.service';
import { response } from 'express';
import { MatSnackBar } from '@angular/material/snack-bar';


interface WorkedDays {
  workedDays: { date: string; bonDeCommandeId: string }[];
}
interface WorkedDay {
  date: string;
  bonDeCommandeId: number;
}

interface GroupedWorkedDay {
  bonDeCommandeId: number;
  dates: string[];
}

interface JourTravaille {
  workedDays: WorkedDay[];
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


@Component({
  selector: 'app-admin-timesheet',
  templateUrl: './admin-timesheet.component.html',
  styleUrl: './admin-timesheet.component.css'
})
export class AdminTimesheetComponent implements OnInit {

  timesheet: any = [];
  bonDeCommandeDetailsMap: { [key: number]: BonDeCommande } = {};
  groupedWorkedDays: any = [];
  bonDeCommandes: BonDeCommande[] = [];
  consultant: any = [];
  isLoading: boolean = true;
  timesheetTotal: number = 0;
  productId: number = 0;
  orderId: number = 0;
  downloadUrl: string | null = null;

  notifications: { [key: number]: string[] } = {};
  showRejectionModal = false;
  selectedBonDeCommandeId: number | null = null;
  rejectionReason = '';

  displayedColumns: string[] = ['order_id', 'order_ref', 'date_commande', 'total_ht', 'dates_worked']; // Define the columns

  dataSource = new MatTableDataSource<BonDeCommande>([]);

  constructor(
    private route: ActivatedRoute,
    private feuilleDeTempsService: FeuilleDeTempsService,
    private dolibarService: DolibarService,
    private userManagementService: UserManagementService,
    private snackBar: MatSnackBar
  ) { }





  ngOnInit(): void {
    this.loadTimesheets();
    // this.validateTimesheet();

  }

  loadTimesheets(): void {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      this.feuilleDeTempsService.getTimesheetById(id).subscribe(
        (data: any) => {
          console.log('Timesheet data:', this.timesheet);
          this.timesheet = data;
          this.fetchBonDeCommandeDetails();
          console.log(data);
          this.timesheetTotal = data.totalJoursT;

          if (data.pieceJointe) {
            const fileBlob = this.decodeBase64(data.pieceJointe, 'application/pdf');
            this.downloadUrl = this.createDownloadLink(fileBlob, 'downloaded-file.pdf');
          }
        },
        (error) => {
          console.error('Error fetching timesheets', error);
        }
      );
    }
    )
  }

  decodeBase64(base64String: string, contentType: string): Blob {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
  
  createDownloadLink(blob: Blob, fileName: string): string {
    const url = window.URL.createObjectURL(blob);
    return url;
  }

  getGroupedWorkedDays(): any[] {
    if (!this.timesheet || !Array.isArray(this.timesheet.jourtravaille)) {
      return [];
    }
    if (!this.bonDeCommandes || !Array.isArray(this.bonDeCommandes)) {
      console.error('Bon de Commandes data is missing or invalid.');
      return [];
    }
  
    const groupedDays: { [key: number]: number } = {};
    // const groupedDays: { [key: number]: { bonDeCommandeId: number, totalDuration: number, dates: string[] } } = {};

  
    this.timesheet.jourtravaille.forEach((entry: any) => {
      entry.workedDays.forEach((day: any) => {
        const duration = Number(day.duration) || 0;
      
      // Initialize the total for this BC if not already set
      if (!groupedDays[day.bonDeCommandeId]) {
        groupedDays[day.bonDeCommandeId] = 0;
      }
      
      // Add the day's duration to the total
      groupedDays[day.bonDeCommandeId] += duration;
  

     })});
     return Object.keys(groupedDays).map(key => ({
      bonDeCommandeId: +key,
      totalDuration: groupedDays[+key]
    }));
  }

  fetchBonDeCommandeDetails(): void {
    const consultantId = this.timesheet?.consultantId;

    this.userManagementService.getConsultantById(consultantId).subscribe(
      (consultantData: any) => {
        this.consultant = consultantData;
        const idErp = consultantData?.idErp;
        this.productId = idErp;
        if (!idErp) {
          console.error('Consultant ID ERP is missing');
          return;
        }

        this.dolibarService.getOrdersById(idErp).subscribe(
          (response: any) => {
            console.log('Bon de Commandes:', response.data);
            this.bonDeCommandes = response.data;
            this.mapBonDeCommandesToTimesheet();
            this.orderId = response.order_id;
          },
          error => {
            console.error('error fetching bon de commande details', error);
          }
        );
      }
    )




  }

  mapBonDeCommandesToTimesheet(): void {
    if (!this.timesheet || !Array.isArray(this.timesheet.jourtravaille)) {
      return;
    }

    const groupedDays = this.getGroupedWorkedDays();

    groupedDays.forEach(entry => {
      const matchBC = this.bonDeCommandes.find(bc => bc.order_id === entry.bonDeCommandeId.toString());
      if (matchBC) {
        this.bonDeCommandeDetailsMap[entry.bonDeCommandeId] = matchBC;
      }
    });
    
  }

  validateTimesheet(orderId: number, productId: number, timesheetTotal: number) {
 
    const timesheetId = this.timesheet.id;
    console.log('body ', orderId,productId,timesheetTotal);

    this.dolibarService.incoiceTimesheet(orderId,Number (productId), timesheetTotal).subscribe((response : any)=>{
     this.showSuccessMessage('la Feuille de Temps a été Facturée avec Succès.');
      console.log('Facture created' , response);
    })

    this.feuilleDeTempsService.validateTimesheet(timesheetId).subscribe(
      (response:any) => {
        this.showSuccessMessage('Feuille de temps validée avec succès.');
        this.timesheet.statut = 'valider';
      },
      (error: any) => {
        console.error('Error validating the timesheet:', error)
      }
    )
   
  }

  openRejectionModal(bonDeCommandeId: number) {
    this.selectedBonDeCommandeId = bonDeCommandeId;
    this.showRejectionModal = true;
  }

  closeRejectionModal() {
    this.showRejectionModal = false;
    this.rejectionReason = '';
  }

  rejectTimesheet(timesheetId: number, reason: string){

    if (!reason) {
      alert('Please provide a reason for rejection.');
      return;
    }

  

    this.feuilleDeTempsService.rejectTimesheet(timesheetId,reason).subscribe(
      response=> {
        this.addNotification(timesheetId, 'Feuille De Temps rejetée: ${reason}');
        this.closeRejectionModal();
      },
      error => {
        console.error('Error rejecting the timesheet', error);
      }
    )
  }

  addNotification(timesheetId: number, message: string) {
    if (!this.notifications[timesheetId]) {
      this.notifications[timesheetId] = [];
    }
    this.notifications[timesheetId].push(message);
  }

 
  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,  
      verticalPosition: 'top',  
      horizontalPosition: 'center'  
    });}

    selectedFile : File | null= null;
    onSelectedFile(event: any){
      this.selectedFile = event.target.file[0];

    }

    createInvoice(orderId: number, productId: number, timesheetTotal: number){
      if(this.selectedFile){
        this.dolibarService.createInvoiceFile(orderId,productId,timesheetTotal,this.selectedFile).subscribe(
          (response)=>{
            console.log('file valid');
          }
        )

      }else{
        console.log("error fetching file");

      }
    }
}
