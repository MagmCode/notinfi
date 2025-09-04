import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnulacionMasivaBdvMesaCambioComponent } from './anulacion-masiva-bdv-mesa-cambio.component';

describe('AnulacionMasivaBdvMesaCambioComponent', () => {
  let component: AnulacionMasivaBdvMesaCambioComponent;
  let fixture: ComponentFixture<AnulacionMasivaBdvMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnulacionMasivaBdvMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnulacionMasivaBdvMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
