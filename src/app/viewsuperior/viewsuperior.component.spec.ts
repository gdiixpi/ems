import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSuperiorsComponent } from './viewsuperior.component';

describe('ViewSuperiorsComponent', () => {
  let component: ViewSuperiorsComponent;
  let fixture: ComponentFixture<ViewSuperiorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSuperiorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSuperiorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
