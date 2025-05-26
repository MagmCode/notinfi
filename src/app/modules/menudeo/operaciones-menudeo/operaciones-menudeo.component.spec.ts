import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionesMenudeoComponent } from './operaciones-menudeo.component';

describe('OperacionesMenudeoComponent', () => {
  let component: OperacionesMenudeoComponent;
  let fixture: ComponentFixture<OperacionesMenudeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperacionesMenudeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacionesMenudeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
