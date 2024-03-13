import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSolicitudSopComponent } from './asignar-solicitud-sop.component';

describe('AsignarSolicitudSopComponent', () => {
  let component: AsignarSolicitudSopComponent;
  let fixture: ComponentFixture<AsignarSolicitudSopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarSolicitudSopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarSolicitudSopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
