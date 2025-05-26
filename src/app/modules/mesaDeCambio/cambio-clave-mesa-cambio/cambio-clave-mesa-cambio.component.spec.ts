import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioClaveMesaCambioComponent } from './cambio-clave-mesa-cambio.component';

describe('CambioClaveMesaCambioComponent', () => {
  let component: CambioClaveMesaCambioComponent;
  let fixture: ComponentFixture<CambioClaveMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioClaveMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioClaveMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
