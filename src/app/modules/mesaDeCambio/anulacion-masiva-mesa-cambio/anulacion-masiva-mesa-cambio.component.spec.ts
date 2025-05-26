import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnulacionMasivaMesaCambioComponent } from './anulacion-masiva-mesa-cambio.component';

describe('AnulacionMasivaMesaCambioComponent', () => {
  let component: AnulacionMasivaMesaCambioComponent;
  let fixture: ComponentFixture<AnulacionMasivaMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnulacionMasivaMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnulacionMasivaMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
