import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFromHomeDetailsComponent } from './work-from-home-details.component';

describe('WorkFromHomeDetailsComponent', () => {
  let component: WorkFromHomeDetailsComponent;
  let fixture: ComponentFixture<WorkFromHomeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFromHomeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFromHomeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
