import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favoriteRecipesKey = 'favoriteRecipes';
  private favoritesSubject = new BehaviorSubject<string[]>(this.getFavorites());

  getFavorites(): string[] {
    return JSON.parse(localStorage.getItem(this.favoriteRecipesKey) || '[]');
  }

  isFavorite(recipeId: string): boolean {
    return this.getFavorites().includes(recipeId);
  }

  toggleFavorite(recipeId: string): void {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(recipeId);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(recipeId);
    }

    localStorage.setItem(this.favoriteRecipesKey, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  getFavoritesObservable(): Observable<string[]> {
    return this.favoritesSubject.asObservable();
  }
}
