import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop'; // if you use resource; else HttpClient
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { Course } from '../../models/course.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'tms-student-dashboard',
  standalone: true,
  imports: [RouterLink, CourseCardComponent],
  templateUrl: './student-dashboard.component.html',
})
export class StudentDashboardComponent {
  private auth = inject(AuthService);
  private coursesApi = inject(CourseService);
  private enrollmentsApi = inject(EnrollmentService);
  private router = inject(Router);

  /** Real user from login JWT */
  studentName = computed(
    () => this.auth.currentUser()?.displayName ?? this.auth.currentUser()?.email ?? 'Student'
  );

  enrollMessage = signal('');
  enrollError = signal('');

  /** Real catalog — adjust to your CourseService API */
  // Option A: if you already use httpResource / rxResource, keep that pattern.
  // Option B: simple signals:
  courses = signal<Course[]>([]);
  coursesLoading = signal(true);
  coursesError = signal(false);

  /** Real enrollments for this student (for counts) */
  myEnrollments = signal<{ id: string | number; status: string; courseName?: string }[]>([]);
  registrationNumber = signal(sessionStorage.getItem('tms_student_id') ?? '—');
  earnedCredits = computed(() => {
    // Until API has real credit hours: 3 credits per Approved enrollment
    const approved = this.myEnrollments().filter((e) => e.status === 'Approved').length;
    return approved * 3;
  });

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? 'Eligible for Graduation' : 'In Progress'
  );

  constructor() {
    void this.loadCatalog();
  }

  async loadCatalog() {
    this.coursesLoading.set(true);
    this.coursesError.set(false);
    try {
      const items = await firstValueFrom(this.coursesApi.getAll());
      this.courses.set(items);
    } catch {
      this.coursesError.set(true);
    } finally {
      this.coursesLoading.set(false);
    }
  }

  async handleEnroll(course: Course) {
    console.log('ENROLL CLICK', course.code, this.auth.getAccessToken(), this.auth.currentUser());
  this.enrollMessage.set('');
  this.enrollError.set('');

  const token = this.auth.getAccessToken();
  const studentId =
  sessionStorage.getItem('tms_student_id') ??
  this.auth.currentUser()?.id;

  if (!studentId) {
  this.enrollError.set('No student id. Register as Student or sign in again.');
  return;
}

  try {
    await firstValueFrom(
  this.enrollmentsApi.enroll({ studentId, courseCode: course.code })
);
    this.enrollMessage.set(`Enrolled in ${course.title}`);
    await this.loadCatalog();
  } catch {
    this.enrollError.set(
      `Could not enroll in ${course.code}. Full, duplicate, or invalid student id.`
    );
  }
}

  /** Optional: keep button but make it real (reload catalog) */
  async registerForClass() {
    await this.loadCatalog();
  }

  logout() {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}