import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioClaveIntervencionComponent } from './cambio-clave-intervencion.component';

describe('CambioClaveIntervencionComponent', () => {
  let component: CambioClaveIntervencionComponent;
  let fixture: ComponentFixture<CambioClaveIntervencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioClaveIntervencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioClaveIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
