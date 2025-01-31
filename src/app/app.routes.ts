import { Routes } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'recipe', pathMatch: 'full' },
  { path: 'recipe', component: RecipesComponent },
];
