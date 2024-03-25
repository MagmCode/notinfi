import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarSolicitudinvComponent } from './reasignar-solicitudinv.component';

describe('ReasignarSolicitudinvComponent', () => {
  let component: ReasignarSolicitudinvComponent;
  let fixture: ComponentFixture<ReasignarSolicitudinvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignarSolicitudinvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasignarSolicitudinvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
