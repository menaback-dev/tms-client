import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentSummaryComponent } from './enrollment-summary.component';

describe('EnrollmentSummaryComponent', () => {
  let component: EnrollmentSummaryComponent;
  let fixture: ComponentFixture<EnrollmentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentSummaryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
