import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearModificarComponent } from './crear-modificar.component';

describe('CrearModificarComponent', () => {
  let component: CrearModificarComponent;
  let fixture: ComponentFixture<CrearModificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearModificarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearModificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
