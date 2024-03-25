import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDesincorporacionComponent } from './datos-desincorporacion.component';

describe('DatosDesincorporacionComponent', () => {
  let component: DatosDesincorporacionComponent;
  let fixture: ComponentFixture<DatosDesincorporacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosDesincorporacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDesincorporacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
