import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root', // Makes this service available throughout the app
})
export class FavoriteService {
  private favoriteRecipesKey = 'favoriteRecipes'; // Key used to store favorites in localStorage
  private favoritesSubject = new BehaviorSubject<string[]>(this.getFavorites()); // BehaviorSubject to track favorite recipe list

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Retrieve the list of favorite recipes from localStorage (if in the browser)
  getFavorites(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      // Only attempt to access localStorage if we're in the browser (not SSR)
      return JSON.parse(localStorage.getItem(this.favoriteRecipesKey) || '[]');
    }
    return []; // Return an empty array if not in the browser (SSR)
  }

  // Check if a recipe is a favorite
  isFavorite(recipeId: string): boolean {
    return this.getFavorites().includes(recipeId); // Checks if the recipeId is in the favorites list
  }

  // Toggle a recipe's favorite status (add or remove from favorites)
  toggleFavorite(recipeId: string): void {
    const favorites = this.getFavorites(); // Get current favorite list
    const index = favorites.indexOf(recipeId); // Find the index of the recipeId in the favorites list

    // If the recipe is already in the favorites, remove it, else add it
    if (index > -1) {
      favorites.splice(index, 1); // Remove from favorites
    } else {
      favorites.push(recipeId); // Add to favorites
    }

    if (isPlatformBrowser(this.platformId)) {
      // Update localStorage with the new list of favorites (only in the browser)
      localStorage.setItem(this.favoriteRecipesKey, JSON.stringify(favorites));
    }

    // Notify all subscribers of the updated favorites list
    this.favoritesSubject.next(favorites);
  }

  // Observable to allow components to subscribe to changes in the favorite list
  getFavoritesObservable(): Observable<string[]> {
    return this.favoritesSubject.asObservable(); // Return observable for subscription
  }
}
