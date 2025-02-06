import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Recipe } from '../../Models/recipe';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../Services/recipes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoriteService } from '../../Services/favorite.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-recipe-details',
  imports: [MatCardModule, MatButtonModule, CommonModule, MatIcon],
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent {
  recipeId!: string | null;
  recipe!: Recipe;
  favoriteStatus: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.recipeId = params.get('id');
      if (this.recipeId) {
        this.recipeService.getRecipeById(this.recipeId).subscribe({
          next: (recipe) => {
            this.recipe = recipe;
            if (this.recipe.id) {
              this.favoriteStatus = this.favoriteService.isFavorite(
                this.recipe.id
              );
            }
          },
          error: (err) => {
            const errorMessage =
              err.message || 'An error occurred while fetching recipe details';
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          },
        });
      }
    });
  }

  isFavorite(recipeId: string | undefined): boolean {
    return recipeId ? this.favoriteService.isFavorite(recipeId) : false;
  }

  toggleFavorite(recipe: Recipe) {
    if (recipe.id) {
      this.favoriteService.toggleFavorite(recipe.id);
    }
  }

  updateRecipe() {
    console.log('updated');
  }
}
