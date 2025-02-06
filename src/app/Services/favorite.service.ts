import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favoriteRecipesKey = 'favoriteRecipes';
  private favoritesSubject = new BehaviorSubject<string[]>(this.getFavorites());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getFavorites(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem(this.favoriteRecipesKey) || '[]');
    }
    return []; // Return an empty array when not in the browser (SSR)
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

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.favoriteRecipesKey, JSON.stringify(favorites));
    }
    this.favoritesSubject.next(favorites);
  }

  getFavoritesObservable(): Observable<string[]> {
    return this.favoritesSubject.asObservable();
  }
}
