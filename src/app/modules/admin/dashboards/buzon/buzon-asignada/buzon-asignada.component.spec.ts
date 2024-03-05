import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonAsignadaComponent } from './buzon-asignada.component';

describe('BuzonAsignadaComponent', () => {
  let component: BuzonAsignadaComponent;
  let fixture: ComponentFixture<BuzonAsignadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonAsignadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonAsignadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
