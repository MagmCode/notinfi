import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaIntercambioMesaCambioComponent } from './consulta-intercambio-mesa-cambio.component';

describe('ConsultaIntercambioMesaCambioComponent', () => {
  let component: ConsultaIntercambioMesaCambioComponent;
  let fixture: ComponentFixture<ConsultaIntercambioMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaIntercambioMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaIntercambioMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
