import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  constructor(private snackBar: MatSnackBar) { }

  handleError(error: any): void {
    let message = 'An unexpected error occurred.';
    
    if (error.status === 0) {
      // Handle CORS or network errors
      message = 'Unable to connect to the server. Please check your internet connection or try again later.';
    } else if (error.status === 404) {
      // Handle 404 errors
      message = 'Resource not found.';
    } else if (error.status === 500) {
      // Handle 500 errors
      message = 'Internal server error.';
    }
    
    this.snackBar.open(message, 'Close', {
      duration: 5000
    });
  }
}
