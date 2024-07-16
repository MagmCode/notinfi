import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConsumiblesComponent } from './modal-consumibles.component';

describe('ModalConsumiblesComponent', () => {
  let component: ModalConsumiblesComponent;
  let fixture: ComponentFixture<ModalConsumiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConsumiblesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConsumiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
