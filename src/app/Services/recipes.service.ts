import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { Recipe } from '../Models/recipe';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/recipes';
  private recipesSubject = new BehaviorSubject<Recipe[]>([]);
  recipes$ = this.recipesSubject.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl).pipe(
      catchError((error) => {
        this.snackBar.open('Error fetching recipes!', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'], // Optional styling
        });
        return throwError(() => error);
      })
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        this.snackBar.open(`Error fetching recipe ${id}`, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => error);
      })
    );
  }

  createNewRecipe(recipeData: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipeData).pipe(
      catchError((error) => {
        this.snackBar.open('Error creating recipe!', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => error);
      })
    );
  }

  deleteRecipeById(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}`).pipe(
      catchError((error) => {
        this.snackBar.open('Error deleting recipe!', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => error);
      })
    );
  }

  updateRecipe(id: string, data: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        this.snackBar.open('Error updating recipe!', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return throwError(() => error);
      })
    );
  }
}
