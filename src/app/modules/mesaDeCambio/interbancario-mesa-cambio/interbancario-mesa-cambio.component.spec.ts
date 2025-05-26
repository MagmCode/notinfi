import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterbancarioMesaCambioComponent } from './interbancario-mesa-cambio.component';

describe('InterbancarioMesaCambioComponent', () => {
  let component: InterbancarioMesaCambioComponent;
  let fixture: ComponentFixture<InterbancarioMesaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterbancarioMesaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterbancarioMesaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
