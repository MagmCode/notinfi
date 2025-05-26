import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTasasbcvMenudeoComponent } from './consulta-tasasbcv-menudeo.component';

describe('ConsultaTasasbcvMenudeoComponent', () => {
  let component: ConsultaTasasbcvMenudeoComponent;
  let fixture: ComponentFixture<ConsultaTasasbcvMenudeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaTasasbcvMenudeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaTasasbcvMenudeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
