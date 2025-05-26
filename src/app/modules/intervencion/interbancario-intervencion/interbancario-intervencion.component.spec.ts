import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterbancarioIntervencionComponent } from './interbancario-intervencion.component';

describe('InterbancarioIntervencionComponent', () => {
  let component: InterbancarioIntervencionComponent;
  let fixture: ComponentFixture<InterbancarioIntervencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterbancarioIntervencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterbancarioIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
