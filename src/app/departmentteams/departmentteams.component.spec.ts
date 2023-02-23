import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentteamsComponent } from './departmentteams.component';

describe('DepartmentteamsComponent', () => {
  let component: DepartmentteamsComponent;
  let fixture: ComponentFixture<DepartmentteamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentteamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
