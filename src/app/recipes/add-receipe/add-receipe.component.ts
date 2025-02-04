import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from '../../Services/recipes.service';
import { ImageService } from '../../Services/image.service';
import { ImageSnippet } from '../../Models/ImageSnipper';
import { FormValidationService } from '../../Services/formValidation.service';

@Component({
  selector: 'app-add-receipe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
  ],
  providers: [FormBuilder],
  templateUrl: './add-receipe.component.html',
  styleUrl: './add-receipe.component.scss',
})
export class AddReceipeComponent {
  recipeForm: FormGroup;
  selectedFile!: ImageSnippet;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private imageService: ImageService,
    private formValidationService: FormValidationService,
    public dialogRef: MatDialogRef<AddReceipeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.recipeForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      thumbnail: [''],
      instructions: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      ingredients: this.fb.array([]),
    });
    this.addIngredient();
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    const ingredientControl = this.fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]);
    this.ingredients.push(ingredientControl);
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  // Form Validation Error Methods
  getErrorMessage(control: AbstractControl | null): string {
    return this.formValidationService.getErrorMessage(control);
  }

  submitForm() {
    if (this.recipeForm.invalid) {
      this.formValidationService.markFormGroupTouched(this.recipeForm);
      return;
    }

    if (!this.selectedFile) {
      // Handle no image selected scenario
      return;
    }

    this.imageService.uploadImage(this.selectedFile.file).subscribe({
      next: (imageResponse) => {
        const recipeData = {
          title: this.recipeForm.get('title')?.value,
          instructions: this.recipeForm.get('instructions')?.value,
          ingredients: (
            this.recipeForm.get('ingredients') as FormArray
          ).controls
            .map((control) => control.value)
            .filter((ing) => ing.trim() !== ''),
          thumbnail: imageResponse.imageUrl,
        };

        this.recipeService.createNewRecipe(recipeData).subscribe({
          next: (newRecipe) => {
            console.log('Recipe created:', newRecipe);
            this.dialogRef.close(newRecipe);
          },
          error: (err) => console.error('Error creating recipe:', err),
        });
      },
      error: (err) => console.error('Error uploading image:', err),
    });
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.imageService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {},
        (err) => {}
      );
    });

    reader.readAsDataURL(file);
  }
}
