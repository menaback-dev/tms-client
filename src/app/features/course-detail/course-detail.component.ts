import { Component, inject, input, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Course } from '../../models/course.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent {
  private http = inject(HttpClient);

  /** Route param :id */
  id = input.required<string>();

  course = signal<Course | null>(null);
  loading = signal(true);
  error = signal('');
  seatsLeft(c: Course): number {
  return Math.max(c.maxCapacity - c.enrollmentCount, 0);
  }

  constructor() {
    effect(() => {
      const courseId = this.id();
      void this.load(courseId);
    });
  }

  private async load(courseId: string) {
    this.loading.set(true);
    this.error.set('');
    this.course.set(null);

    try {
      // Prefer GET /api/courses/{id} if you have it
      const c = await firstValueFrom(
        this.http.get<Course>(`${environment.apiUrl}/courses/${courseId}`)
      );
      this.course.set(c);
    } catch {
      // Fallback: list and find (if no detail endpoint)
      try {
        const page = await firstValueFrom(
          this.http.get<{ items?: Course[]; data?: Course[] } | Course[]>(
            `${environment.apiUrl}/courses`,
            { params: { page: '1', pageSize: '100' } }
          )
        );
        const list = Array.isArray(page)
          ? page
          : page.items ?? page.data ?? [];
        const found = list.find((x) => String(x.id) === String(courseId)) ?? null;
        if (!found) this.error.set('Course not found.');
        this.course.set(found);

      } catch {
        this.error.set('Could not load course. Is the API running?');
      }
    } finally {
      this.loading.set(false);
    }
  }

  get isFull(): boolean {
    const c = this.course();
    if (!c) return false;
    return c.enrollmentCount >= c.maxCapacity;
  }
}