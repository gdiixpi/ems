import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewprojectreportsComponent } from './viewprojectreports.component';

describe('ViewprojectreportsComponent', () => {
  let component: ViewprojectreportsComponent;
  let fixture: ComponentFixture<ViewprojectreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewprojectreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewprojectreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
