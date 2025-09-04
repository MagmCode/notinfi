import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarDirectoMesaCambioComponent } from './consultar-directo-mesa-cambio.component';

describe('ConsultarDirectoMesaCambioComponent', () => {
  let component: ConsultarDirectoMesaCambioComponent;
  let fixture: ComponentFixture<ConsultarDirectoMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarDirectoMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarDirectoMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
