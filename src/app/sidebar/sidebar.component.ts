import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  UserEmail: string | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.UserEmail = localStorage.getItem('UserEmail');
      this.userRole = localStorage.getItem('role');
      
    
      const decodedToken = this.authService.getDecodedToken();
      if (decodedToken) {
        
        this.userRole = decodedToken.role || this.userRole;
      }
     
    }
  }
  

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get globalLink(): string {
   
    return this.userRole === 'ADMIN' ? '/admin-vue-globale' : '/vue-globale';
  }
}
