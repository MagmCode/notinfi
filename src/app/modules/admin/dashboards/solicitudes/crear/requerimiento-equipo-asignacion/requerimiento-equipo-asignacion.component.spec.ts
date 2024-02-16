import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientoEquipoAsignacionComponent } from './requerimiento-equipo-asignacion.component';

describe('RequerimientoEquipoAsignacionComponent', () => {
  let component: RequerimientoEquipoAsignacionComponent;
  let fixture: ComponentFixture<RequerimientoEquipoAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientoEquipoAsignacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequerimientoEquipoAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
