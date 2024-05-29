import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveduriaSolictudAFCComponent } from './proveduria-solictud-afc.component';

describe('ProveduriaSolictudAFCComponent', () => {
  let component: ProveduriaSolictudAFCComponent;
  let fixture: ComponentFixture<ProveduriaSolictudAFCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProveduriaSolictudAFCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveduriaSolictudAFCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
