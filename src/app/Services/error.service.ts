import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();

  showError(message: string, duration: number = 5000) {
    this.errorMessageSubject.next(message);

    setTimeout(() => {
      this.clearError();
    }, duration);
  }

  clearError() {
    this.errorMessageSubject.next(null);
  }
}
