import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreportsComponent } from './addreports.component';

describe('AddreportsComponent', () => {
  let component: AddreportsComponent;
  let fixture: ComponentFixture<AddreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
