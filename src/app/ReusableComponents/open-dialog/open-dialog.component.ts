import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-open-dialog',
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './open-dialog.component.html',
  styleUrl: './open-dialog.component.scss',
})
export class OpenDialogComponent {}
