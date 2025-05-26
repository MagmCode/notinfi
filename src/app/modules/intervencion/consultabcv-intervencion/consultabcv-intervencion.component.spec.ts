import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultabcvIntervencionComponent } from './consultabcv-intervencion.component';

describe('ConsultabcvIntervencionComponent', () => {
  let component: ConsultabcvIntervencionComponent;
  let fixture: ComponentFixture<ConsultabcvIntervencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultabcvIntervencionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultabcvIntervencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
