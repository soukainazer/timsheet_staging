import { Component,  OnInit, Inject } from '@angular/core';
import { FeuilleDeTempsService } from '../feuille-de-temps.service';
import { DolibarService } from '../DataService/dolibar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorHandlerService } from '../error-handler.service';

interface BonDeCommande {
  order_id: number;
  order_ref: string;
  date_commande : string | null;
  total_ht: string;
  nomber_of_days: string;
  nomber_de_jour_consumes: string;
  nombre_de_jour_restants: string;
}

@Component({
  selector: 'app-add-bon-de-commande',
  templateUrl: './add-bon-de-commande.component.html',
  styleUrl: './add-bon-de-commande.component.css'
})
export class AddBonDeCommandeComponent implements OnInit {

  bonsDeCommande: BonDeCommande[] = [];
 selectedBonDeCommande: any | null = null;


  constructor(
    @Inject(DolibarService) private dolibarService : DolibarService,
    public dialogRef: MatDialogRef<AddBonDeCommandeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idErp: number },
    private errorHandler: ErrorHandlerService
  ){}

  ngOnInit(): void {
    console.log('AddBonDeCommandeComponent initialized');
    this.getBonDeCommande();
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
      } else{
        console.log('Failed to fetch orders');
      }
    },
    error => {
      this.errorHandler.handleError(error);
    }
   );
 
  }
 

  onSubmit(): void {
    if (this.selectedBonDeCommande !== null) {
      console.log('Selected Order ID:', this.selectedBonDeCommande.order_id);
      this.dialogRef.close(this.selectedBonDeCommande);
    } else {
      console.error('No order selected.');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
