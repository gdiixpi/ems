import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringModuleComponent } from './hiring-module.component';

describe('HiringModuleComponent', () => {
  let component: HiringModuleComponent;
  let fixture: ComponentFixture<HiringModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiringModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
