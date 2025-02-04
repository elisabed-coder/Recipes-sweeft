import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent implements OnInit {
  @Input() errorMessage: string | null = null;

  ngOnInit(): void {}
}
