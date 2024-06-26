import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarSolCaciComponent } from './reasignar-sol-caci.component';

describe('ReasignarSolCaciComponent', () => {
  let component: ReasignarSolCaciComponent;
  let fixture: ComponentFixture<ReasignarSolCaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignarSolCaciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasignarSolCaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
