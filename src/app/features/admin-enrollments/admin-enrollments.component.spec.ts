import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnrollmentsComponent } from './admin-enrollments.component';

describe('AdminEnrollmentsComponent', () => {
  let component: AdminEnrollmentsComponent;
  let fixture: ComponentFixture<AdminEnrollmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEnrollmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEnrollmentsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
