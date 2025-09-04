import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandaInterbancariaMesaCambioComponent } from './demanda-interbancaria-mesa-cambio.component';

describe('DemandaInterbancariaMesaCambioComponent', () => {
  let component: DemandaInterbancariaMesaCambioComponent;
  let fixture: ComponentFixture<DemandaInterbancariaMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandaInterbancariaMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandaInterbancariaMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
