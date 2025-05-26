import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntencionVentaComponent } from './intencion-venta.component';

describe('IntencionVentaComponent', () => {
  let component: IntencionVentaComponent;
  let fixture: ComponentFixture<IntencionVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntencionVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntencionVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
