import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionSolicitudComponent } from './atencion-solicitud.component';

describe('AtencionSolicitudComponent', () => {
  let component: AtencionSolicitudComponent;
  let fixture: ComponentFixture<AtencionSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtencionSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
