import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Recipe } from '../../Models/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../Services/recipes.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-recipe',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.scss',
})
export class EditRecipeComponent {
  recipeId!: number | null;
  recipe!: Recipe;

  constructor(
    private route: ActivatedRoute,
    private RecipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.recipeId = params.get('id') ? +params.get('id')! : null; // convert to number
      console.log('Editing Recipe ID:', this.recipeId); // Debugging purpose
      if (this.recipeId) {
        this.RecipeService.getRecipeById(this.recipeId).subscribe((recipe) => {
          this.recipe = recipe;
          console.log('Recipe Details:', this.recipe); // Debugging purpose
        });
      }
    });
  }
  updateRecipe() {
    console.log('updated');
  }
}
