import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientoEquipoDesincorporacionComponent } from './requerimiento-equipo-desincorporacion.component';

describe('RequerimientoEquipoDesincorporacionComponent', () => {
  let component: RequerimientoEquipoDesincorporacionComponent;
  let fixture: ComponentFixture<RequerimientoEquipoDesincorporacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientoEquipoDesincorporacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequerimientoEquipoDesincorporacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
