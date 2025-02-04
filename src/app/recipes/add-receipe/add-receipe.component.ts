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
    MatIconModule,
  ],
  providers: [FormBuilder],
  templateUrl: './add-receipe.component.html',
  styleUrl: './add-receipe.component.scss',
})
export class AddReceipeComponent {
  recipeForm: FormGroup;
  selectedFile!: ImageSnippet;

  @Input() isEditMode: boolean = false;
  @Input() selectedRecipe!: Recipe;
  @Output() EmitTaskData = new EventEmitter<Recipe>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private imageService: ImageService,
    private formValidationService: FormValidationService
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
  }

  ngOnInit() {
    if (this.isEditMode && this.selectedRecipe) {
      this.recipeForm.patchValue({
        title: this.selectedRecipe.title,
        instructions: this.selectedRecipe.instructions,
      });
      this.selectedRecipe.ingredients.forEach((ingredient: string) => {
        this.ingredients.push(
          this.fb.control(ingredient, [
            Validators.required,
            Validators.minLength(2),
          ])
        );
      });
    }
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(
      this.fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ])
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
        const recipeData: Recipe = {
          title: this.recipeForm.get('title')?.value,
          instructions: this.recipeForm.get('instructions')?.value,
          ingredients: this.ingredients.controls
            .map((control) => control.value)
            .filter((ing) => ing.trim() !== ''),
          thumbnail: imageResponse.imageUrl,
        };

        this.recipeService.createNewRecipe(recipeData).subscribe({
          next: (newRecipe) => {
            console.log('Recipe created:', newRecipe);
            this.EmitTaskData.emit(newRecipe); // Emit the created recipe
            this.recipeForm.reset(); // Reset form after submission
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

  onCancel() {
    this.cancel.emit();
  }
}
