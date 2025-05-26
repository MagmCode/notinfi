import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnulacionIntervencionComponent } from './anulacion-intervencion.component';

describe('AnulacionIntervencionComponent', () => {
  let component: AnulacionIntervencionComponent;
  let fixture: ComponentFixture<AnulacionIntervencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnulacionIntervencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnulacionIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
