import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioClaveMenudeoComponent } from './cambio-clave-menudeo.component';

describe('CambioClaveMenudeoComponent', () => {
  let component: CambioClaveMenudeoComponent;
  let fixture: ComponentFixture<CambioClaveMenudeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioClaveMenudeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioClaveMenudeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
