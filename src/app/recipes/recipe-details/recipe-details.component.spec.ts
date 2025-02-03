import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecipeComponent } from './recipe-details.component';

describe('EditRecipeComponent', () => {
  let component: EditRecipeComponent;
  let fixture: ComponentFixture<EditRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRecipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
