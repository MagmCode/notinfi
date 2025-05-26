import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultabcvMenudeoComponent } from './consultabcv-menudeo.component';

describe('ConsultabcvMenudeoComponent', () => {
  let component: ConsultabcvMenudeoComponent;
  let fixture: ComponentFixture<ConsultabcvMenudeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultabcvMenudeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultabcvMenudeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
