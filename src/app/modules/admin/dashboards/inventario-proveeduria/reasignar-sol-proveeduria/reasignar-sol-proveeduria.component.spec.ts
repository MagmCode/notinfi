import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarSolProveeduriaComponent } from './reasignar-sol-proveeduria.component';

describe('ReasignarSolProveeduriaComponent', () => {
  let component: ReasignarSolProveeduriaComponent;
  let fixture: ComponentFixture<ReasignarSolProveeduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignarSolProveeduriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasignarSolProveeduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
