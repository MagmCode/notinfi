import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModeloImpresoraComponent } from './modal-modelo-impresora.component';

describe('ModalModeloImpresoraComponent', () => {
  let component: ModalModeloImpresoraComponent;
  let fixture: ComponentFixture<ModalModeloImpresoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalModeloImpresoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalModeloImpresoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
