import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSolProveeduriaDESComponent } from './asignar-sol-proveeduria-des.component';

describe('AsignarSolProveeduriaDESComponent', () => {
  let component: AsignarSolProveeduriaDESComponent;
  let fixture: ComponentFixture<AsignarSolProveeduriaDESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarSolProveeduriaDESComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarSolProveeduriaDESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
