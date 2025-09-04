import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaInterbancariaMesaCambioComponent } from './consulta-interbancaria-mesa-cambio.component';

describe('ConsultaInterbancariaMesaCambioComponent', () => {
  let component: ConsultaInterbancariaMesaCambioComponent;
  let fixture: ComponentFixture<ConsultaInterbancariaMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaInterbancariaMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaInterbancariaMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
