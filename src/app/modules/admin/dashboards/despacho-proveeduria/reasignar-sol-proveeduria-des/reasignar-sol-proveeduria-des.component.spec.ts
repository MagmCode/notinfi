import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarSolProveeduriaDESComponent } from './reasignar-sol-proveeduria-des.component';

describe('ReasignarSolProveeduriaDESComponent', () => {
  let component: ReasignarSolProveeduriaDESComponent;
  let fixture: ComponentFixture<ReasignarSolProveeduriaDESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasignarSolProveeduriaDESComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasignarSolProveeduriaDESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
