import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandaMesaCambioComponent } from './demanda-mesa-cambio.component';

describe('DemandaMesaCambioComponent', () => {
  let component: DemandaMesaCambioComponent;
  let fixture: ComponentFixture<DemandaMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandaMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandaMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
