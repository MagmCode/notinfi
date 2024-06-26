import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosSolicitudSgComponent } from './datos-solicitud-sg.component';

describe('DatosSolicitudSgComponent', () => {
  let component: DatosSolicitudSgComponent;
  let fixture: ComponentFixture<DatosSolicitudSgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosSolicitudSgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosSolicitudSgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
