import { Component, inject } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'tms-enrollment-summary',
  standalone: true,
  templateUrl: './enrollment-summary.component.html',
  styleUrl: './enrollment-summary.component.scss',
})
export class EnrollmentSummaryComponent {
  store = inject(EnrollmentStore);
}