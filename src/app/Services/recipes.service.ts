import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../Models/recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}`);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  createNewRecipe(recipeData: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}`, recipeData);
  }

  deleteRecipeById(recipeId: string): Observable<Recipe> {
    return this.http.delete<Recipe>(`${this.apiUrl}/${recipeId}`);
  }
}
