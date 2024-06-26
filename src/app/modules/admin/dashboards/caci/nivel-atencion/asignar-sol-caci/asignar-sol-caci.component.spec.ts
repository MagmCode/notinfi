import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSolCaciComponent } from './asignar-sol-caci.component';

describe('AsignarSolCaciComponent', () => {
  let component: AsignarSolCaciComponent;
  let fixture: ComponentFixture<AsignarSolCaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarSolCaciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarSolCaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
