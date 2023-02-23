import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtasksComponent } from './viewtasks.component';

describe('ViewtasksComponent', () => {
  let component: ViewtasksComponent;
  let fixture: ComponentFixture<ViewtasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewtasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
