import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionSolicitudComponent } from './decision-solicitud.component';

describe('DecisionSolicitudComponent', () => {
  let component: DecisionSolicitudComponent;
  let fixture: ComponentFixture<DecisionSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
