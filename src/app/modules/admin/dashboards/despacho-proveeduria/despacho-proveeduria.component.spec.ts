import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespachoProveeduriaComponent } from './despacho-proveeduria.component';

describe('DespachoProveeduriaComponent', () => {
  let component: DespachoProveeduriaComponent;
  let fixture: ComponentFixture<DespachoProveeduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DespachoProveeduriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DespachoProveeduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
