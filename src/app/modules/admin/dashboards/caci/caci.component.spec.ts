import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaciComponent } from './caci.component';

describe('CaciComponent', () => {
  let component: CaciComponent;
  let fixture: ComponentFixture<CaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
