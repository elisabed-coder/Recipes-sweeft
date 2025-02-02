import { Routes } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { EditRecipeComponent } from './recipes/edit-recipe/edit-recipe.component';

export const routes: Routes = [
  { path: '', redirectTo: 'recipe', pathMatch: 'full' },
  { path: 'recipe', component: RecipesComponent },
  { path: 'edit-recipe/:id', component: EditRecipeComponent },
];
