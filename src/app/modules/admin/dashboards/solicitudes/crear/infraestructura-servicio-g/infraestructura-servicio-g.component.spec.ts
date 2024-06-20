import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfraestructuraServicioGComponent } from './infraestructura-servicio-g.component';

describe('InfraestructuraServicioGComponent', () => {
  let component: InfraestructuraServicioGComponent;
  let fixture: ComponentFixture<InfraestructuraServicioGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfraestructuraServicioGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfraestructuraServicioGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
