import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDesicionSopComponent } from './modal-desicion-sop.component';

describe('ModalDesicionSopComponent', () => {
  let component: ModalDesicionSopComponent;
  let fixture: ComponentFixture<ModalDesicionSopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDesicionSopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDesicionSopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
