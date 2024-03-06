import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolicitdComponent } from './detalle-solicitd.component';

describe('DetalleSolicitdComponent', () => {
  let component: DetalleSolicitdComponent;
  let fixture: ComponentFixture<DetalleSolicitdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSolicitdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSolicitdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
