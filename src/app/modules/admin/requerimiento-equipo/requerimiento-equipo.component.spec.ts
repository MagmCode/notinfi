import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientoEquipoComponent } from './requerimiento-equipo.component';

describe('RequerimientoEquipoComponent', () => {
  let component: RequerimientoEquipoComponent;
  let fixture: ComponentFixture<RequerimientoEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientoEquipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequerimientoEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
