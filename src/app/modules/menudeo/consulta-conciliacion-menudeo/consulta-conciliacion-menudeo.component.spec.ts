import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaConciliacionMenudeoComponent } from './consulta-conciliacion-menudeo.component';

describe('ConsultaConciliacionMenudeoComponent', () => {
  let component: ConsultaConciliacionMenudeoComponent;
  let fixture: ComponentFixture<ConsultaConciliacionMenudeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaConciliacionMenudeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaConciliacionMenudeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
