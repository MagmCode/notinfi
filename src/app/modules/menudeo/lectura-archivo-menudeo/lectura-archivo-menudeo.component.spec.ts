import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaArchivoMenudeoComponent } from './lectura-archivo-menudeo.component';

describe('LecturaArchivoMenudeoComponent', () => {
  let component: LecturaArchivoMenudeoComponent;
  let fixture: ComponentFixture<LecturaArchivoMenudeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaArchivoMenudeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaArchivoMenudeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
