import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioProveeduriaComponent } from './inventario-proveeduria.component';

describe('InventarioProveeduriaComponent', () => {
  let component: InventarioProveeduriaComponent;
  let fixture: ComponentFixture<InventarioProveeduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioProveeduriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioProveeduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
