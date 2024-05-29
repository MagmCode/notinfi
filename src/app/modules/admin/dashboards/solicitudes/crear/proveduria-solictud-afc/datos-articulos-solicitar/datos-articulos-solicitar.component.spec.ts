import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosArticulosSolicitarComponent } from './datos-articulos-solicitar.component';

describe('DatosArticulosSolicitarComponent', () => {
  let component: DatosArticulosSolicitarComponent;
  let fixture: ComponentFixture<DatosArticulosSolicitarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosArticulosSolicitarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosArticulosSolicitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
