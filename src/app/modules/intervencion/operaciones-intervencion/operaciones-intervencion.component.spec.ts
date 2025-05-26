import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionesIntervencionComponent } from './operaciones-intervencion.component';

describe('OperacionesIntervencionComponent', () => {
  let component: OperacionesIntervencionComponent;
  let fixture: ComponentFixture<OperacionesIntervencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperacionesIntervencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacionesIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
