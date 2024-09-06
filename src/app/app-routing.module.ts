import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { VueGeneraleComponent } from './vue-generale/vue-generale.component';
import { authGuard } from './auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { AdminVueGlobalComponent } from './admin-vue-global/admin-vue-global.component';
import { AdminTimesheetComponent } from './admin-timesheet/admin-timesheet.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ConsultantDetailsComponent } from './consultant-details/consultant-details.component';
import { AddBonDeCommandeComponent } from './add-bon-de-commande/add-bon-de-commande.component';
import { WaitingPageComponent } from './waiting-page/waiting-page.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent},
  { path: 'waiting-page', component: WaitingPageComponent },

  {
     path:'' ,
    component: LayoutComponent,
    canActivate: [authGuard],
    children:[
      { path: 'vue-globale', component: VueGeneraleComponent   },
      { path: 'timesheet/:consultantId/:year/:month', component: TimesheetComponent , data: { roles: ['CONSULTANT'] } },
      { path: 'admin-vue-globale', component: AdminVueGlobalComponent },
      { path: 'admin/timesheet/:id', component: AdminTimesheetComponent },
      { path: 'consultant', component: AdminDashboardComponent },
      { path: 'consultant/:id', component: ConsultantDetailsComponent  },
      { path: 'add-bon-de-commande', component: AddBonDeCommandeComponent },
    ],
  },
  


  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
