import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateRecipeComponent } from './add-or-update-recipe.component';

describe('Addor', () => {
  let component: AddOrUpdateRecipeComponent;
  let fixture: ComponentFixture<AddOrUpdateRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrUpdateRecipeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddOrUpdateRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
