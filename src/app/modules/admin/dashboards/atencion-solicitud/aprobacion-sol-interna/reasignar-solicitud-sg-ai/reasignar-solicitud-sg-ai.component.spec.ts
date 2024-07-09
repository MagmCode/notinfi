import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarSolicitudSgAiComponent } from './reasignar-solicitud-sg-ai.component';

describe('ReasignarSolicitudSgAiComponent', () => {
  let component: ReasignarSolicitudSgAiComponent;
  let fixture: ComponentFixture<ReasignarSolicitudSgAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignarSolicitudSgAiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasignarSolicitudSgAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
