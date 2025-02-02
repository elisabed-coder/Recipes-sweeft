import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Recipe } from '../Models/recipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeService } from '../Services/recipes.service';

@Component({
  selector: 'app-recipes',
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent {
  http = inject(HttpClient);
  recipes: Recipe[] = [];
  currentRecipeId!: number;
  selectedRecipe: Recipe | undefined;

  constructor(private router: Router, private recipeService: RecipeService) {}

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

  EditRecipe(id: number | undefined) {
    if (id) {
      this.currentRecipeId = id;

      this.selectedRecipe = this.recipes.find((recipe) => recipe.id === id);
      this.router.navigate(['edit-recipe', id]);
    }
  }
}
