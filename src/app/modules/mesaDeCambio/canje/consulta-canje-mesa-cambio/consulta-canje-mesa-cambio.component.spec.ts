import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCanjeMesaCambioComponent } from './consulta-canje-mesa-cambio.component';

describe('ConsultaCanjeMesaCambioComponent', () => {
  let component: ConsultaCanjeMesaCambioComponent;
  let fixture: ComponentFixture<ConsultaCanjeMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaCanjeMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCanjeMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
