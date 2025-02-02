import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormArray,
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
class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

export class AddReceipeComponent {
  recipeForm: FormGroup;
  selectedFile: ImageSnippet;

  constructor(
    private fb: FormBuilder,
    private imageService: ImageService,
    private recipeService: RecipeService,
    public dialogRef: MatDialogRef<AddReceipeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      thumbnail: ['', Validators.required],
      instructions: ['', Validators.required],
      ingredients: this.fb.array([]),
    });
    this.addIngredient();
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

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.fb.control('', Validators.required));
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  submitForm() {
    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;
      formValue.ingredients = formValue.ingredients.filter(
        (ing: string) => ing.trim() !== ''
      );

      this.recipeService.createNewRecipe(formValue).subscribe({
        next: (newRecipe) => {
          console.log('Recipe created:', newRecipe);
          this.dialogRef.close(newRecipe);
        },
        error: (err) => console.error('Error creating recipe:', err),
      });
    }
  }
}
