import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Recipe } from '../Models/recipe';

@Component({
  selector: 'app-recipes',
  imports: [],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
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
