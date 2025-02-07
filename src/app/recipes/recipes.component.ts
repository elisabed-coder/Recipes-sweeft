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
import { AddOrUpdateRecipeComponent } from './add-or-update-recipe/add-or-update-recipe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDeleteComponent } from '../utility/confirm-delete/confirm-delete.component';
import { FavoriteService } from '../Services/favorite.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RecipeFilterService } from '../Services/recipe-filter.service';

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
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  showOnlyFavorites: boolean = false;

  // Inject dependencies
  http = inject(HttpClient);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);

  currentRecipeId!: string;
  selectedRecipe!: Recipe;
  showCreateRecipeForm: boolean = false;

  searchTerm: string = '';

  isLoading: boolean = false;
  editMode: boolean = false;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private favoriteService: FavoriteService,
    private recipeFilterService: RecipeFilterService
  ) {}

  ngOnInit(): void {
    this.fetchRecipes();

    // Track favorite changes
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
        this.applyFilters();
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err, 'Close', { duration: 3000 });
      },
    });
  }

  // Navigate to a recipe's detail page
  getRecipeDetails(id: string | undefined) {
    if (id) {
      this.currentRecipeId = id;
      this.selectedRecipe =
        this.recipes.find((recipe) => recipe.id === id) ?? ({} as Recipe);
      this.router.navigate(['recipe', id]);
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
              this.applyFavoriteFilter();
              this.snackBar.open('Recipe deleted successfully', 'Close', {
                duration: 3000,
              });
            },
            error: (error) => {
              this.snackBar.open(error, 'Close', {
                duration: 3000,
              });
            },
          });
        }
      });
    }
  }

  // Handle recipe create/update actions
  CreateOrUpdateRecipe(recipe: Recipe) {
    this.showCreateRecipeForm = false;
    this.fetchRecipes();
  }

  // Show form for editing a recipe
  OnEditRecipeClicked(id: string | undefined) {
    if (id) {
      this.selectedRecipe =
        this.recipes.find((recipe) => recipe.id === id) || ({} as Recipe);
      this.showCreateRecipeForm = true;
      this.editMode = true;
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
    );
  }

  // Filter input change handling
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
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
