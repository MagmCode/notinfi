import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldecisionesComponent } from './modaldecisiones.component';

describe('ModaldecisionesComponent', () => {
  let component: ModaldecisionesComponent;
  let fixture: ComponentFixture<ModaldecisionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaldecisionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldecisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
