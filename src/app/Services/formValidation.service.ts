import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  // Method to return an error message based on the validation error in a form control
  getErrorMessage(control: AbstractControl | null): string {
    if (!control) return ''; // If no control is provided, return an empty string

    if (control.hasError('required')) {
      return 'This field is required'; // check if has 'required error' and return a relevant message
    }

    if (control.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Minimum length is ${requiredLength} characters`;
      // check if has 'min length' and return a relevant message
    }

    if (control.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${requiredLength} characters`;
      // check if has 'max length' and return a relevant message
    }

    return ''; // If no errors are found return an empty string
  }

  // mark all controls in a FormGroup as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched(); // Mark the control as toucheds

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
