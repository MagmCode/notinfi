import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultabcvMesaCambioComponent } from './consultabcv-mesa-cambio.component';

describe('ConsultabcvMesaCambioComponent', () => {
  let component: ConsultabcvMesaCambioComponent;
  let fixture: ComponentFixture<ConsultabcvMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultabcvMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultabcvMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
