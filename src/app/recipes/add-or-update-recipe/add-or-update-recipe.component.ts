import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormArray,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService } from '../../Services/recipes.service';
import { ImageService } from '../../Services/image.service';
import { ImageSnippet } from '../../Models/ImageSnipper';
import { FormValidationService } from '../../Services/formValidation.service';
import { Recipe } from '../../Models/recipe';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-or-update-recipe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  providers: [FormBuilder],
  templateUrl: './add-or-update-recipe.component.html',
  styleUrls: ['./add-or-update-recipe.component.scss'],
})
export class AddOrUpdateRecipeComponent {
  recipeForm: FormGroup;
  selectedFile!: ImageSnippet;
  submitted: boolean = false;

  @Input() isEditMode: boolean = false;
  @Input() selectedRecipe!: any;
  @Output() EmitTaskData = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private imageService: ImageService,
    private formValidationService: FormValidationService,
    private snackBar: MatSnackBar // Inject MatSnackBar
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
      thumbnail: ['', Validators.required],
      instructions: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      ingredients: this.fb.array([
        new FormControl('', [Validators.required, Validators.minLength(2)]),
      ]),
    });
  }

  ngOnInit() {
    if (this.isEditMode && this.selectedRecipe) {
      this.recipeForm.patchValue({
        title: this.selectedRecipe.title,
        instructions: this.selectedRecipe.instructions,
        thumbnail: this.selectedRecipe.thumbnail,
      });
      this.selectedRecipe.ingredients.forEach((ingredient: string) => {
        this.ingredients.push(
          this.fb.control(ingredient, [
            Validators.required,
            Validators.minLength(2),
          ])
        );
      });
      if (this.selectedRecipe.thumbnail) {
        this.selectedFile = new ImageSnippet(
          this.selectedRecipe.thumbnail,
          new File([], 'placeholder')
        );
      }
      if (this.ingredients.length === 0) {
        this.addIngredient();
      }
    }
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(
      this.fb.control('', [Validators.required, Validators.minLength(2)])
    );
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  getErrorMessage(control: AbstractControl | null): string {
    return this.formValidationService.getErrorMessage(control);
  }

  submitForm() {
    this.submitted = true;
    if (this.recipeForm.invalid || this.ingredients.length === 0) {
      this.formValidationService.markFormGroupTouched(this.recipeForm);
      return;
    }

    const thumbnailValue = this.recipeForm.get('thumbnail')?.value;

    if (!thumbnailValue) {
      return;
    }

    let recipeData: Recipe = {
      title: this.recipeForm.get('title')?.value || '',
      instructions: this.recipeForm.get('instructions')?.value || '',
      ingredients: this.ingredients.controls
        .map((control) => control.value)
        .filter((ing) => ing.trim() !== ''),
      thumbnail: thumbnailValue,
    };

    // Check if a new image was selected
    if (
      this.selectedFile?.file &&
      this.selectedFile.file.name !== 'placeholder'
    ) {
      // Only upload image if a new file is selected
      this.imageService.uploadImage(this.selectedFile.file).subscribe({
        next: (imageResponse) => {
          recipeData.thumbnail = imageResponse.imageUrl; // Update with new image URL
          this.saveRecipe(recipeData);
        },
        error: (err) => {
          console.error('Error uploading image:', err);
          this.snackBar.open(
            'Error uploading image. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
    } else {
      // No new image, just save the recipe with existing thumbnail
      this.saveRecipe(recipeData);
    }
  }

  private saveRecipe(recipeData: Recipe) {
    const recipeObservable = this.isEditMode
      ? this.recipeService.updateRecipe(
          this.selectedRecipe.id || '',
          recipeData
        )
      : this.recipeService.createNewRecipe(recipeData);

    recipeObservable.subscribe({
      next: (recipe) => {
        console.log(
          this.isEditMode ? 'Recipe updated:' : 'Recipe created:',
          recipe
        );
        this.EmitTaskData.emit(recipe);
        this.recipeForm.reset();
        this.snackBar.open('Recipe saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => {
        console.error(
          this.isEditMode ? 'Error updating recipe:' : 'Error creating recipe:',
          err
        );
        this.snackBar.open(
          `Error: ${
            this.isEditMode ? 'Updating' : 'Creating'
          } recipe. Please try again.`,
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
      },
    });
  }

  processFile(imageInput: HTMLInputElement) {
    const file: File | null = imageInput.files ? imageInput.files[0] : null;
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);

      // Update the form control before uploading
      this.recipeForm.patchValue({
        thumbnail: event.target.result,
      });

      this.imageService.uploadImage(this.selectedFile.file).subscribe({
        next: (res) => {
          this.recipeForm.patchValue({
            thumbnail: res.imageUrl,
          });
          this.recipeForm.get('thumbnail')?.markAsTouched();
        },
        error: (err) => {
          console.error('Image upload failed', err);
          // Reset the form control on error
          this.recipeForm.get('thumbnail')?.setErrors({ uploadError: true });
          this.snackBar.open(
            'Error uploading image. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
    });

    reader.readAsDataURL(file);
  }

  onCancel() {
    this.cancel.emit();
  }
}
