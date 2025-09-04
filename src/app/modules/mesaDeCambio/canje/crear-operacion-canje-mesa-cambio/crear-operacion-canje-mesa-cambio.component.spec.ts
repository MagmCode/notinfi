import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearOperacionCanjeMesaCambioComponent } from './crear-operacion-canje-mesa-cambio.component';

describe('CrearOperacionCanjeMesaCambioComponent', () => {
  let component: CrearOperacionCanjeMesaCambioComponent;
  let fixture: ComponentFixture<CrearOperacionCanjeMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearOperacionCanjeMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearOperacionCanjeMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
