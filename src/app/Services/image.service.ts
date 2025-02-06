import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imageServerUrl = 'http://localhost:3001';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {} // Inject MatSnackBar

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http
      .post<{ imageUrl: string }>(`${this.imageServerUrl}/upload`, formData)
      .pipe(catchError(this.handleError.bind(this))); // Use bind to maintain context
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error.error || error.message;
    }

    // Display the error message in the Snackbar
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000, // Show for 5 seconds
      panelClass: ['error-snackbar'], // Optional class for styling
    });

    // Return the error to the component for further handling if necessary
    return throwError(() => new Error(errorMessage));
  }
}
