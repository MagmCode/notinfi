import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PactoInterbanInterbancariaMesaCambioComponent } from './pacto-interban-interbancaria-mesa-cambio.component';

describe('PactoInterbanInterbancariaMesaCambioComponent', () => {
  let component: PactoInterbanInterbancariaMesaCambioComponent;
  let fixture: ComponentFixture<PactoInterbanInterbancariaMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PactoInterbanInterbancariaMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PactoInterbanInterbancariaMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
