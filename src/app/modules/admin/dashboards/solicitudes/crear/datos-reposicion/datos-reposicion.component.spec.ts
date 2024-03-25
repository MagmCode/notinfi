import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosReposicionComponent } from './datos-reposicion.component';

describe('DatosReposicionComponent', () => {
  let component: DatosReposicionComponent;
  let fixture: ComponentFixture<DatosReposicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosReposicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosReposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
