import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImpresoraComponent } from './modal-impresora.component';

describe('ModalImpresoraComponent', () => {
  let component: ModalImpresoraComponent;
  let fixture: ComponentFixture<ModalImpresoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalImpresoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalImpresoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
