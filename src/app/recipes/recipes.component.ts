import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Recipe } from '../Models/recipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-recipes',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent {
  http = inject(HttpClient);
  recipes: Recipe[] = [];

  private apiUrl = 'http://localhost:3001/recipes';

  constructor() {
    this.getRecipes().subscribe((data: Recipe[]) => {
      console.log(data);
      this.recipes = data;
    });
  }

  getRecipes() {
    return this.http.get<Recipe[]>(`${this.apiUrl}`);
  }
}
