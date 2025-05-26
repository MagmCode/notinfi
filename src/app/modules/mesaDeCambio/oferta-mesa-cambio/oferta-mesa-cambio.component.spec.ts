import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaMesaCambioComponent } from './oferta-mesa-cambio.component';

describe('OfertaMesaCambioComponent', () => {
  let component: OfertaMesaCambioComponent;
  let fixture: ComponentFixture<OfertaMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfertaMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
