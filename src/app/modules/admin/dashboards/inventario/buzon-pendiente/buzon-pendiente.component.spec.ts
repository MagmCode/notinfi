import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonPendienteComponent } from './buzon-pendiente.component';

describe('BuzonPendienteComponent', () => {
  let component: BuzonPendienteComponent;
  let fixture: ComponentFixture<BuzonPendienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonPendienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonPendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
