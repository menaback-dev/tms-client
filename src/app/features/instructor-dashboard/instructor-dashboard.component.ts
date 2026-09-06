import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnrollmentStore } from '../../store/enrollment.store';
import { AnalyticsChartComponent } from '../../ui/analytics-chart/analytics-chart.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { GradeSubmissionComponent } from '../grade-submission/grade-submission.component';

@Component({
  selector: 'tms-instructor-dashboard',
  standalone: true,
  imports: [AnalyticsChartComponent, RouterLink, GradeSubmissionComponent],
  templateUrl: './instructor-dashboard.component.html',
})
export class InstructorDashboardComponent implements OnInit {
  store = inject(EnrollmentStore);
  private auth = inject(AuthService);
  private router = inject(Router);

  instructorName = computed(
    () => this.auth.currentUser()?.displayName ?? 'Instructor'
  );

  /** Only approved enrollments — roster for the instructor */
  approvedEnrollments = computed(() =>
    this.store.entities().filter((e) => e.status === 'Approved')
  );

  approvedCount = computed(() => this.approvedEnrollments().length);

  ngOnInit() {
    this.store.loadEnrollments();
  }

  logout() {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}