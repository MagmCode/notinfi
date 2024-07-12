import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionServgeneralesComponent } from './administracion-servgenerales.component';

describe('AdministracionServgeneralesComponent', () => {
  let component: AdministracionServgeneralesComponent;
  let fixture: ComponentFixture<AdministracionServgeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionServgeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionServgeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
