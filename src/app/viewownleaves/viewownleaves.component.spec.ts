import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewownleavesComponent } from './viewownleaves.component';

describe('ViewownleavesComponent', () => {
  let component: ViewownleavesComponent;
  let fixture: ComponentFixture<ViewownleavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewownleavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewownleavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
