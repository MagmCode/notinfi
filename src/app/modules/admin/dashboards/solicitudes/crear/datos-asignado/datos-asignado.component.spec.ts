import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAsignadoComponent } from './datos-asignado.component';

describe('DatosAsignadoComponent', () => {
  let component: DatosAsignadoComponent;
  let fixture: ComponentFixture<DatosAsignadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosAsignadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosAsignadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
