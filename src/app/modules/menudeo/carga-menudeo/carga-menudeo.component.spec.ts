import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaMenudeoComponent } from './carga-menudeo.component';

describe('CargaMenudeoComponent', () => {
  let component: CargaMenudeoComponent;
  let fixture: ComponentFixture<CargaMenudeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaMenudeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaMenudeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
