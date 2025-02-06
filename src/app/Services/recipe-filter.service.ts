import { Injectable } from '@angular/core';
import { Recipe } from '../Models/recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeFilterService {
  filterRecipes(recipes: Recipe[], searchTerm: string = ''): Recipe[] {
    if (!searchTerm) return recipes;

    const normalizedSearch = searchTerm.toLowerCase();

    return recipes.filter((recipe) =>
      this.matchesSearch(recipe, normalizedSearch)
    );
  }

  private matchesSearch(recipe: Recipe, searchTerm: string): boolean {
    // Check if search term matches title
    const titleMatch = recipe.title.toLowerCase().includes(searchTerm);

    // Check if search term matches any ingredient
    const ingredientMatch = recipe.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(searchTerm)
    );

    return titleMatch || ingredientMatch;
  }
}
