import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JornadaIntervencionComponent } from './jornada-intervencion.component';

describe('JornadaIntervencionComponent', () => {
  let component: JornadaIntervencionComponent;
  let fixture: ComponentFixture<JornadaIntervencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JornadaIntervencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JornadaIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
