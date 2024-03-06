import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIngresarEquipoComponent } from './modal-ingresar-equipo.component';

describe('ModalIngresarEquipoComponent', () => {
  let component: ModalIngresarEquipoComponent;
  let fixture: ComponentFixture<ModalIngresarEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalIngresarEquipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIngresarEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
