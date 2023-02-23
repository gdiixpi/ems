import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultieventCalenderComponent } from './multievent-calender.component';

describe('MultieventCalenderComponent', () => {
  let component: MultieventCalenderComponent;
  let fixture: ComponentFixture<MultieventCalenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultieventCalenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultieventCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
