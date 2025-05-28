import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDefinitivaBcvComponent } from './consulta-definitiva-bcv.component';

describe('ConsultaDefinitivaBcvComponent', () => {
  let component: ConsultaDefinitivaBcvComponent;
  let fixture: ComponentFixture<ConsultaDefinitivaBcvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaDefinitivaBcvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaDefinitivaBcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
