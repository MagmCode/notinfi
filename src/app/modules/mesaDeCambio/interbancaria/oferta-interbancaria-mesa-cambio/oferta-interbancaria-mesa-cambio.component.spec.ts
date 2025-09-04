import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaInterbancariaMesaCambioComponent } from './oferta-interbancaria-mesa-cambio.component';

describe('OfertaInterbancariaMesaCambioComponent', () => {
  let component: OfertaInterbancariaMesaCambioComponent;
  let fixture: ComponentFixture<OfertaInterbancariaMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfertaInterbancariaMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaInterbancariaMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
