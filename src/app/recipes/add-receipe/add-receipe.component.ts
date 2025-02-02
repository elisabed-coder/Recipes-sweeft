import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-add-receipe',
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './add-receipe.component.html',
  styleUrl: './add-receipe.component.scss',
})
export class AddReceipeComponent {}
