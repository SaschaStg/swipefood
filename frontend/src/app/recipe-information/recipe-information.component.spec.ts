import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeInformationComponent } from './recipe-information.component';

describe('RecipeDetailsComponent', () => {
  let component: RecipeInformationComponent;
  let fixture: ComponentFixture<RecipeInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
