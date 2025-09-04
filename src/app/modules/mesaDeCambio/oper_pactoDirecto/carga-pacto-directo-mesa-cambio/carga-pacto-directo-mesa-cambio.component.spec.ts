import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaPactoDirectoMesaCambioComponent } from './carga-pacto-directo-mesa-cambio.component';

describe('CargaPactoDirectoMesaCambioComponent', () => {
  let component: CargaPactoDirectoMesaCambioComponent;
  let fixture: ComponentFixture<CargaPactoDirectoMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaPactoDirectoMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaPactoDirectoMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
