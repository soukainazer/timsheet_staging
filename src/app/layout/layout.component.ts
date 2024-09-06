import { Component, OnInit } from '@angular/core';
import {  Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  showSidebar = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !['/login', '/signup', '/waiting-page'].includes(event.urlAfterRedirects);
      }
    });
  }
}
