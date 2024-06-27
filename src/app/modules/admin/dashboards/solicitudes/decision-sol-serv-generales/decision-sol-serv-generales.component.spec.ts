import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionSolServGeneralesComponent } from './decision-sol-serv-generales.component';

describe('DecisionSolServGeneralesComponent', () => {
  let component: DecisionSolServGeneralesComponent;
  let fixture: ComponentFixture<DecisionSolServGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionSolServGeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionSolServGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
