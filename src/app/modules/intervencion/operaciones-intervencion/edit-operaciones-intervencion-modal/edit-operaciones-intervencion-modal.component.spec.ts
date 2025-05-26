import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOperacionesIntervencionModalComponent } from './edit-operaciones-intervencion-modal.component';

describe('EditOperacionesIntervencionModalComponent', () => {
  let component: EditOperacionesIntervencionModalComponent;
  let fixture: ComponentFixture<EditOperacionesIntervencionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOperacionesIntervencionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOperacionesIntervencionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
