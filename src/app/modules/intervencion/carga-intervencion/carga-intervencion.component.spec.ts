import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaIntervencionComponent } from './carga-intervencion.component';

describe('CargaIntervencionComponent', () => {
  let component: CargaIntervencionComponent;
  let fixture: ComponentFixture<CargaIntervencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaIntervencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
