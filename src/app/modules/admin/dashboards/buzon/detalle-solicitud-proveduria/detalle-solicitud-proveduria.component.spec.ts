import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolicitudProveduriaComponent } from './detalle-solicitud-proveduria.component';

describe('DetalleSolicitudProveduriaComponent', () => {
  let component: DetalleSolicitudProveduriaComponent;
  let fixture: ComponentFixture<DetalleSolicitudProveduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSolicitudProveduriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSolicitudProveduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
