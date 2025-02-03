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
import { ImageService } from '../../Services/image.service';
import { ImageSnippet } from '../../Models/ImageSnipper';

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

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private imageService: ImageService,
    public dialogRef: MatDialogRef<AddReceipeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      thumbnail: [''],
      instructions: ['', Validators.required],
      ingredients: this.fb.array([]),
    });
    this.addIngredient();
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
    if (this.recipeForm.valid && this.selectedFile) {
      // Upload the image first
      this.imageService.uploadImage(this.selectedFile.file).subscribe({
        next: (imageResponse) => {
          const imageUrl = imageResponse.imageUrl;

          // Create the recipe with the image URL
          const recipeData = {
            title: this.recipeForm.get('title')?.value,
            instructions: this.recipeForm.get('instructions')?.value,
            ingredients: (
              this.recipeForm.get('ingredients') as FormArray
            ).controls
              .map((control) => control.value)
              .filter((ing) => ing.trim() !== ''), // Filter out empty ingredients
            thumbnail: imageUrl,
          };

          // Send the recipe data to JSON Server
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
    } else {
      console.error('Form is invalid or no image selected');
    }
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
