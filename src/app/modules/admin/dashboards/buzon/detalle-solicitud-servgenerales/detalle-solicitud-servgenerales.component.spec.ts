import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolicitudServgeneralesComponent } from './detalle-solicitud-servgenerales.component';

describe('DetalleSolicitudServgeneralesComponent', () => {
  let component: DetalleSolicitudServgeneralesComponent;
  let fixture: ComponentFixture<DetalleSolicitudServgeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSolicitudServgeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSolicitudServgeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
