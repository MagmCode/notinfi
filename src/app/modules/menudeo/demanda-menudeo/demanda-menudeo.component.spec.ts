import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandaMenudeoComponent } from './demanda-menudeo.component';

describe('DemandaMenudeoComponent', () => {
  let component: DemandaMenudeoComponent;
  let fixture: ComponentFixture<DemandaMenudeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandaMenudeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandaMenudeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
