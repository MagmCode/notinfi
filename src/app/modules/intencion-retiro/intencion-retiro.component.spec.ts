import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntencionRetiroComponent } from './intencion-retiro.component';

describe('IntencionRetiroComponent', () => {
  let component: IntencionRetiroComponent;
  let fixture: ComponentFixture<IntencionRetiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntencionRetiroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntencionRetiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
