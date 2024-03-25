import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientoEquipoReposicionComponent } from './requerimiento-equipo-reposicion.component';

describe('RequerimientoEquipoReposicionComponent', () => {
  let component: RequerimientoEquipoReposicionComponent;
  let fixture: ComponentFixture<RequerimientoEquipoReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientoEquipoReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequerimientoEquipoReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
