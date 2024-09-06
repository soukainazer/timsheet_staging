import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementService } from '../user-management.service';
import { DolibarService } from '../DataService/dolibar.service';
import { error } from 'console';
import { ErrorHandlerService } from '../error-handler.service';

interface ConsultantErp {
  id: string;
  label: string;
}
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
  
  idErp?: string; 
}

@Component({
  selector: 'app-consultant-details',
  templateUrl: './consultant-details.component.html',
  styleUrl: './consultant-details.component.css'
})
export class ConsultantDetailsComponent implements OnInit {

  consultant: any;
  orders: any;
  consultantErp: ConsultantErp[] = [];
  selectedConsultantId: string | null = null;
 


  constructor( private route: ActivatedRoute,
               private userManagementService: UserManagementService,
               private router: Router,
               private dolibarService: DolibarService,
               private errorHandler : ErrorHandlerService
              ){}

             
              ngOnInit(): void {
                this.route.paramMap.subscribe(params => {
                  const idParam = params.get('id');
                  const id = idParam ? +idParam : 0; // Nb
                  
                  const productid = 12;
              
                  this.dolibarService.getOrdersById(productid).subscribe((data)=>{
                    this.orders = data ; 
                    console.log('Orders by id data ' , this.orders);
                  },
                    error=> {
                      this.errorHandler.handleError(error);
                    }
                )
                  if (id) {
                    this.userManagementService.getConsultantById(id).subscribe(
                      data  => {this.consultant = data,
                         console.log('Consultant data:', this.consultant);
                         
                        },
                      
                      error => {console.error('Error fetching consultant details', error);
                        
                   } );
                  }
                });
                this.loadConsultants();
                
              }

              loadConsultants(): void {
                this.dolibarService.getProducts().subscribe(
                  (data: ConsultantErp[]) => {
                    this.consultantErp = data.map(c => ({ label: c.label, id: c.id }));
                  },
                  error => {
                    console.error('Error fetching consultants', error);
                    this.errorHandler.handleError(error);
                  }
                );
              }

              
              onConsultantChange(event: any): void {
                this.selectedConsultantId = event.target.value;
                console.log('Selected Consultant ID:', this.selectedConsultantId);
               
              }

              updateIdErp(): void {
                if (this.consultant && this.selectedConsultantId ){
                  const consultantId = this.consultant.id;
                  this.userManagementService.updateIdErp(consultantId,this.selectedConsultantId).subscribe(
                    () => {
                      console.log('idErp updated successfully');
                      //this.goBack();
                    },
                  );
                }
              }
              
              goBack(): void {
                this.router.navigate(['/consultant']); 
              }

              
              

}
