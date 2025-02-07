import { Component } from '@angular/core';
import { Recipe } from '../../Models/recipe';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../Services/recipes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardImage, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoriteService } from '../../Services/favorite.service';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../Services/error-handling.service';

@Component({
  selector: 'app-recipe-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIcon,
    MatCardImage,
  ],
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent {
  recipeId!: string | null; // stores the recipe ID from the route
  recipe!: Recipe; // stores the recipe details
  favoriteStatus: boolean = false; // tracks if the recipe is a favorite

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar,
    private favoriteService: FavoriteService,
    private router: Router,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    // fetch recipe ID from the route and get recipe details
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
            // handle error and show a snackbar
            return this.errorHandler.handleError(
              'An error occurred while fetching recipe details'
            );
          },
        });
      }
    });
  }

  isFavorite(recipeId: string | undefined): boolean {
    // check if the recipe is a favorite
    return recipeId ? this.favoriteService.isFavorite(recipeId) : false;
  }

  toggleFavorite(recipe: Recipe) {
    // toggle the favorite status of the recipe
    if (recipe.id) {
      this.favoriteService.toggleFavorite(recipe.id);
    }
  }

  goBack() {
    // navigate back to the recipes list
    this.router.navigate(['/recipes']);
  }
}
