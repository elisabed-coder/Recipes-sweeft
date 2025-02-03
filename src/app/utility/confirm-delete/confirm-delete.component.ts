import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogContent,
  MatDialogClose,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
  ],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
}
