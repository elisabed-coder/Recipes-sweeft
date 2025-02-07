import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Recipe } from '../Models/recipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeService } from '../Services/recipes.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOrUpdateRecipeComponent } from './add-or-update-recipe/add-or-update-recipe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDeleteComponent } from '../utility/confirm-delete/confirm-delete.component';
import { FavoriteService } from '../Services/favorite.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RecipeFilterService } from '../Services/recipe-filter.service';
import { ErrorHandlingService } from '../Services/error-handling.service';

@Component({
  selector: 'app-recipes',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinner,
    AddOrUpdateRecipeComponent,
  ],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent {
  recipes: Recipe[] = []; // List of recipes
  filteredRecipes: Recipe[] = []; // Filtered recipes based on search and favorite status
  showOnlyFavorites: boolean = false; // Flag to show only favorite recipes

  http = inject(HttpClient); // Inject HttpClient for HTTP requests
  readonly dialog = inject(MatDialog); // Inject MatDialog for dialogs
  readonly snackBar = inject(MatSnackBar); // Inject MatSnackBar for notifications

  currentRecipeId!: string; // Stores the current selected recipe ID
  selectedRecipe!: Recipe; // Stores the selected recipe
  showCreateRecipeForm: boolean = false; // Flag to show the create/update form

  searchTerm: string = ''; // Search term for filtering recipes

  isLoading: boolean = false; // Loading state
  editMode: boolean = false; // Flag to toggle edit mode for recipes

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private favoriteService: FavoriteService,
    private recipeFilterService: RecipeFilterService,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.fetchRecipes(); // Fetch recipes on initialization

    // Track favorite changes and apply the filter
    this.favoriteService.getFavoritesObservable().subscribe(() => {
      this.applyFavoriteFilter();
    });
  }

  // Fetch recipes from the service
  fetchRecipes() {
    this.isLoading = true;
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.isLoading = false;
        this.recipes = recipes;
        this.applyFilters(); // Apply filters after fetching recipes
      },
      error: (err) => {
        this.isLoading = false;
        this.errorHandler.handleError(err);
      },
    });
  }

  // Navigate to a recipe's detail page
  getRecipeDetails(id: string | undefined) {
    if (id) {
      this.currentRecipeId = id;
      this.selectedRecipe =
        this.recipes.find((recipe) => recipe.id === id) ?? ({} as Recipe);
      this.router.navigate(['recipe', id]); // Navigate to recipe details
    }
  }

  // Delete a recipe with confirmation
  DeleteRecipe(id: string | undefined) {
    if (id) {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent);

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.recipeService.deleteRecipeById(id).subscribe({
            next: () => {
              this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
              this.applyFavoriteFilter(); // Reapply favorite filter after deletion
              this.snackBar.open('Recipe deleted successfully', 'Close', {
                duration: 3000,
              });
            },
            error: (error) => {
              this.errorHandler.handleError(error);
            },
          });
        }
      });
    }
  }

  // Handle recipe create/update actions
  CreateOrUpdateRecipe(recipe: Recipe) {
    this.showCreateRecipeForm = false;
    this.fetchRecipes(); // Re-fetch recipes after creation or update
  }

  // Show form for editing a recipe
  OnEditRecipeClicked(id: string | undefined) {
    if (id) {
      this.selectedRecipe =
        this.recipes.find((recipe) => recipe.id === id) || ({} as Recipe);
      this.showCreateRecipeForm = true;
      this.editMode = true; // Set edit mode to true
    }
  }

  // Hide form and reset edit mode
  onCancel() {
    this.showCreateRecipeForm = false;
    this.editMode = false;
  }

  // Check if a recipe is a favorite
  isFavorite(recipeId: string | undefined): boolean {
    return recipeId ? this.favoriteService.isFavorite(recipeId) : false;
  }

  // Toggle recipe's favorite status
  toggleFavorite(recipe: Recipe) {
    if (recipe.id) {
      this.favoriteService.toggleFavorite(recipe.id);
    }
  }

  // Switch between showing all or only favorite recipes
  toggleFavoriteFilter() {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    this.applyFavoriteFilter(); // Reapply the favorite filter
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

  private applyFilters() {
    let tempRecipes = [...this.recipes];

    if (this.showOnlyFavorites) {
      tempRecipes = tempRecipes.filter(
        (recipe) => recipe.id && this.favoriteService.isFavorite(recipe.id)
      );
    }

    this.filteredRecipes = this.recipeFilterService.filterRecipes(
      tempRecipes,
      this.searchTerm
    ); // Apply search filter
  }

  // Filter input change handling
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters(); // Reapply filters on search input change
  }

  // Generate random color for background
  getColor = () => `#${Math.random().toString(16).slice(-6)}66`;

  color: string = this.getColor();

  // Set background style with a radial gradient
  setBackgroundStyle() {
    return {
      background: `radial-gradient(${this.color}, #39393f)`,
      'box-shadow': `0 0 60px ${this.color}`,
    };
  }
}
