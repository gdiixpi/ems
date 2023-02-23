import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KraManagementComponent } from './kra-management.component';

describe('KraManagementComponent', () => {
  let component: KraManagementComponent;
  let fixture: ComponentFixture<KraManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KraManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KraManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
