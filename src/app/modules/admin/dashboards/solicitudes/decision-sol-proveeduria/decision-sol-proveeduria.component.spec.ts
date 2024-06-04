import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionSolProveeduriaComponent } from './decision-sol-proveeduria.component';

describe('DecisionSolProveeduriaComponent', () => {
  let component: DecisionSolProveeduriaComponent;
  let fixture: ComponentFixture<DecisionSolProveeduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionSolProveeduriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionSolProveeduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
