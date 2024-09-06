import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VueGeneraleComponent } from './vue-generale/vue-generale.component';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { AdminVueGlobalComponent } from './admin-vue-global/admin-vue-global.component';
import { AdminTimesheetComponent } from './admin-timesheet/admin-timesheet.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ConsultantDetailsComponent } from './consultant-details/consultant-details.component';
import { AddBonDeCommandeComponent } from './add-bon-de-commande/add-bon-de-commande.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DolibarService } from './DataService/dolibar.service';
import { WaitingPageComponent } from './waiting-page/waiting-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    VueGeneraleComponent,
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    TimesheetComponent,
    AdminVueGlobalComponent,
    AdminTimesheetComponent,
    AdminDashboardComponent,
    ConsultantDetailsComponent,
    AddBonDeCommandeComponent,
    WaitingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AgGridModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatTableModule,
    MatChipsModule,
    BrowserAnimationsModule,

  ],
  providers: [
    provideClientHydration(),
    AuthService,
    DolibarService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
