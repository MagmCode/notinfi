import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelAtencionComponent } from './nivel-atencion.component';

describe('NivelAtencionComponent', () => {
  let component: NivelAtencionComponent;
  let fixture: ComponentFixture<NivelAtencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelAtencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
