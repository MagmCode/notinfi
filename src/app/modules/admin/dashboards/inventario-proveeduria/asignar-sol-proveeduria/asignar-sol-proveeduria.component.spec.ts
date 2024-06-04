import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSolProveeduriaComponent } from './asignar-sol-proveeduria.component';

describe('AsignarSolProveeduriaComponent', () => {
  let component: AsignarSolProveeduriaComponent;
  let fixture: ComponentFixture<AsignarSolProveeduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarSolProveeduriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarSolProveeduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
