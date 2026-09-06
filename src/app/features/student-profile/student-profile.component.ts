import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-student-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-profile.component.html',
})
export class StudentProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private enrollmentsApi = inject(EnrollmentService);

  registrationNumber = signal(
    sessionStorage.getItem('tms_student_id') ?? '—'
  );
  displayName = signal(this.auth.currentUser()?.displayName ?? 'Student');
  email = signal(this.auth.currentUser()?.email ?? '');

  myEnrollments = signal<Enrollment[]>([]);
  loading = signal(true);
  error = signal('');

  async ngOnInit() {
    await this.loadEnrollments();
  }

  async loadEnrollments() {
    this.loading.set(true);
    this.error.set('');
    const reg = sessionStorage.getItem('tms_student_id');

    try {
      const all = await firstValueFrom(this.enrollmentsApi.getAll());
      // Keep only this student's rows (API may return all for now)
      const mine = reg
        ? all.filter(
            (e) =>
              String(e.studentId) === reg ||
              (e as any).studentRegistrationNumber === reg
          )
        : [];
      this.myEnrollments.set(mine);
    } catch {
      this.error.set('Could not load enrollments. API may restrict GET to instructors.');
      this.myEnrollments.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}