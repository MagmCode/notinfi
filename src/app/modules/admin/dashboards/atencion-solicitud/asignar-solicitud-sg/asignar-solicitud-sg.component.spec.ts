import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSolicitudSgComponent } from './asignar-solicitud-sg.component';

describe('AsignarSolicitudSgComponent', () => {
  let component: AsignarSolicitudSgComponent;
  let fixture: ComponentFixture<AsignarSolicitudSgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarSolicitudSgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarSolicitudSgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
