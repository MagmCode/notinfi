import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlProcesosComponent } from './control-procesos.component';

describe('ControlProcesosComponent', () => {
  let component: ControlProcesosComponent;
  let fixture: ComponentFixture<ControlProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlProcesosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
