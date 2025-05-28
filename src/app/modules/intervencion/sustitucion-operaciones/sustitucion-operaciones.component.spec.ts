import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SustitucionOperacionesComponent } from './sustitucion-operaciones.component';

describe('SustitucionOperacionesComponent', () => {
  let component: SustitucionOperacionesComponent;
  let fixture: ComponentFixture<SustitucionOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SustitucionOperacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SustitucionOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
