import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Recipe } from '../Models/recipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeService } from '../Services/recipes.service';
import { MatDialog } from '@angular/material/dialog';
import { AddReceipeComponent } from './add-receipe/add-receipe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDeleteComponent } from '../utility/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-recipes',
  imports: [MatCardModule, MatButtonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent {
  http = inject(HttpClient);
  readonly dialog = inject(MatDialog);

  recipes: Recipe[] = [];
  currentRecipeId!: string;
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

  EditRecipe(id: string | undefined) {
    if (id) {
      this.currentRecipeId = id;

      this.selectedRecipe = this.recipes.find((recipe) => recipe.id === id);
      this.router.navigate(['edit-recipe', id]);
    }
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(AddReceipeComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  DeleteRecipe(id: string | undefined) {
    if (id) {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent);

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.recipeService.deleteRecipeById(id).subscribe({
            next: () => {
              console.log('Recipe Deleted Successfully');
              this.fetchRecipes();
            },
            error: (error) => console.log(error),
          });
        }
      });
    }
  }
}
