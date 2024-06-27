import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarSolicitudSgComponent } from './reasignar-solicitud-sg.component';

describe('ReasignarSolicitudSgComponent', () => {
  let component: ReasignarSolicitudSgComponent;
  let fixture: ComponentFixture<ReasignarSolicitudSgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignarSolicitudSgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasignarSolicitudSgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
