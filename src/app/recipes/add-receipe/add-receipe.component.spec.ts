import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReceipeComponent } from './add-receipe.component';

describe('AddReceipeComponent', () => {
  let component: AddReceipeComponent;
  let fixture: ComponentFixture<AddReceipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReceipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReceipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
