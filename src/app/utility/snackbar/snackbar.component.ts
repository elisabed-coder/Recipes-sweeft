import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../Services/error.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  private subscription: Subscription | null = null;

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage$.subscribe(
      (message) => (this.errorMessage = message)
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  closeSnackbar(): void {
    this.errorService.clearError();
  }
}
