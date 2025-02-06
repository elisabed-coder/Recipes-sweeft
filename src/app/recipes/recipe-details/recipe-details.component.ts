import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Recipe } from '../../Models/recipe';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../Services/recipes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-recipe-details',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent {
  recipeId!: string | null;
  recipe!: Recipe;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.recipeId = params.get('id');
      console.log('Recipe ID:', this.recipeId); // Debugging purpose
      if (this.recipeId) {
        this.recipeService.getRecipeById(this.recipeId).subscribe({
          next: (recipe) => {
            this.recipe = recipe;
            console.log('Recipe Details:', this.recipe); // Debugging purpose
          },
          error: (err) => {
            const errorMessage =
              err.message || 'An error occurred while fetching recipe details';
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000, // Show for 5 seconds
              panelClass: ['error-snackbar'], // Optional class for styling
            });
          },
        });
      }
    });
  }

  updateRecipe() {
    console.log('updated');
  }
}
