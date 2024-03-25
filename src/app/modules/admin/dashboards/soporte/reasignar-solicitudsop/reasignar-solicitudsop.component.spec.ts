import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarSolicitudsopComponent } from './reasignar-solicitudsop.component';

describe('ReasignarSolicitudsopComponent', () => {
  let component: ReasignarSolicitudsopComponent;
  let fixture: ComponentFixture<ReasignarSolicitudsopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignarSolicitudsopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasignarSolicitudsopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
