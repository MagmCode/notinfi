import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SustitucionesPendientesComponent } from './sustituciones-pendientes.component';

describe('SustitucionesPendientesComponent', () => {
  let component: SustitucionesPendientesComponent;
  let fixture: ComponentFixture<SustitucionesPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SustitucionesPendientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SustitucionesPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
