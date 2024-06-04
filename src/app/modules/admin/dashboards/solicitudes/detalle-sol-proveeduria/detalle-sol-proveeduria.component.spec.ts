import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolProveeduriaComponent } from './detalle-sol-proveeduria.component';

describe('DetalleSolProveeduriaComponent', () => {
  let component: DetalleSolProveeduriaComponent;
  let fixture: ComponentFixture<DetalleSolProveeduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSolProveeduriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSolProveeduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
