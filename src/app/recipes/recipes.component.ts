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
import { FavoriteService } from '../Services/favorite.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipes',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    AddReceipeComponent,
    MatIconModule,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent {
  recipes: Recipe[] = [];

  filteredRecipes: Recipe[] = [];
  showOnlyFavorites: boolean = false;

  http = inject(HttpClient);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);

  currentRecipeId!: string;
  selectedRecipe!: Recipe;
  showCreateRecipeForm: boolean = false;

  isLoading: boolean = false;

  editMode: boolean = false;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.fetchRecipes();

    this.favoriteService.getFavoritesObservable().subscribe(() => {
      this.applyFavoriteFilter();
    });
  }

  fetchRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        console.log(recipes);
        this.applyFavoriteFilter();
      },
      error: (err) => {
        this.isLoading = false;
      },
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
              this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
              this.applyFavoriteFilter();
              this.snackBar.open('Recipe deleted successfully', 'Close', {
                duration: 3000,
              });
            },
            error: (error) => {
              console.log(error);
              this.snackBar.open('Failed to delete recipe', 'Close', {
                duration: 3000,
              });
            },
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

  isFavorite(recipeId: string | undefined): boolean {
    return recipeId ? this.favoriteService.isFavorite(recipeId) : false;
  }

  toggleFavorite(recipe: Recipe) {
    if (recipe.id) {
      this.favoriteService.toggleFavorite(recipe.id);
    }
  }

  toggleFavoriteFilter() {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    this.applyFavoriteFilter();
  }

  private applyFavoriteFilter() {
    if (this.showOnlyFavorites) {
      this.filteredRecipes = this.recipes.filter(
        (recipe) => recipe.id && this.favoriteService.isFavorite(recipe.id)
      );
    } else {
      this.filteredRecipes = [...this.recipes];
    }
  }
}
