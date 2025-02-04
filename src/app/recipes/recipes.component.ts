import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { Recipe } from '../Models/recipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeService } from '../Services/recipes.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddReceipeComponent } from './add-receipe/add-receipe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDeleteComponent } from '../utility/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-recipes',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    AddReceipeComponent,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent {
  recipes: Recipe[] = [];

  http = inject(HttpClient);
  readonly dialog = inject(MatDialog);

  currentRecipeId!: string;
  selectedRecipe!: Recipe;
  showCreateRecipeForm: boolean = false;

  isLoading: boolean = false;

  editMode: boolean = false;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        console.log(recipes);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  getRecipeDetails(id: string | undefined) {
    if (id) {
      this.currentRecipeId = id;

      this.selectedRecipe =
        this.recipes.find((recipe) => recipe.id === id) ?? ({} as Recipe);
      this.router.navigate(['recipe', id]);
    }
  }

  DeleteRecipe(id: string | undefined) {
    if (id) {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent);

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.recipeService.deleteRecipeById(id).subscribe({
            next: () => {
              console.log('Recipe Deleted Successfully');
              this.recipes = [
                ...this.recipes.filter((recipe) => recipe.id !== id),
              ]; // Assign a new reference
              // this.cdr.markForCheck();
            },
            error: (error) => console.log(error),
          });
        }
      });
    }
  }

  CreateOrUpdateRecipe(recipe: Recipe) {
    console.log('Received recipe:', recipe);
    // Handle creating/updating logic here
    this.showCreateRecipeForm = false; // Hide form after submission
    this.fetchRecipes();
  }

  OnEditRecipeClicked(id: string | undefined) {
    if (id) {
      this.selectedRecipe =
        this.recipes.find((recipe) => recipe.id === id) || ({} as Recipe);
      this.showCreateRecipeForm = true;
      this.editMode = true;
    }
  }

  onCancel() {
    this.showCreateRecipeForm = false;
    this.editMode = false;
  }
}
