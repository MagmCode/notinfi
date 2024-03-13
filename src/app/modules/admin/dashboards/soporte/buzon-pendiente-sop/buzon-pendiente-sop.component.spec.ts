import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonPendienteSopComponent } from './buzon-pendiente-sop.component';

describe('BuzonPendienteSopComponent', () => {
  let component: BuzonPendienteSopComponent;
  let fixture: ComponentFixture<BuzonPendienteSopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonPendienteSopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonPendienteSopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
