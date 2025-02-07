import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { Recipe } from '../Models/recipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/recipes';
  private recipesSubject = new BehaviorSubject<Recipe[]>([]);
  recipes$ = this.recipesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlingService
  ) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl).pipe(
      catchError((error) => {
        return this.errorHandler.handleError(error);
      })
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        return this.errorHandler.handleError(`Error fetching recipe ${id}`);
      })
    );
  }

  createNewRecipe(recipeData: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipeData).pipe(
      catchError((error) => {
        return this.errorHandler.handleError('Error creating recipe!');
      })
    );
  }

  deleteRecipeById(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}`).pipe(
      catchError((error) => {
        return this.errorHandler.handleError('Error deleting recipe!');
      })
    );
  }

  updateRecipe(id: string, data: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        return this.errorHandler.handleError('Error updating recipe!');
      })
    );
  }
}
