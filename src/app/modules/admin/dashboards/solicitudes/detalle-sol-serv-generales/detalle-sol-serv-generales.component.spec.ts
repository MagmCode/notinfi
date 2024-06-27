import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolServGeneralesComponent } from './detalle-sol-serv-generales.component';

describe('DetalleSolServGeneralesComponent', () => {
  let component: DetalleSolServGeneralesComponent;
  let fixture: ComponentFixture<DetalleSolServGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSolServGeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSolServGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
