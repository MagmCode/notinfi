import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionSolInternaComponent } from './aprobacion-sol-interna.component';

describe('AprobacionSolInternaComponent', () => {
  let component: AprobacionSolInternaComponent;
  let fixture: ComponentFixture<AprobacionSolInternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionSolInternaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionSolInternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
