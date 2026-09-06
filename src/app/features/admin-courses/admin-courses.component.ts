import { Component, inject, OnInit, signal, viewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'tms-admin-courses',
  standalone: true,
  imports: [ReactiveFormsModule, MatPaginatorModule],
  templateUrl: './admin-courses.component.html',
})
export class AdminCoursesComponent implements OnInit {
  private api = inject(CourseService);
  private fb = inject(FormBuilder);

  courses = signal<Course[]>([]);
  totalCount = signal(0);
  pageIndex = signal(0);   // MatPaginator is 0-based
  pageSize = signal(10);
  loading = signal(false);
  message = signal('');
  error = signal('');

  createForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    title: ['', Validators.required],
    maxCapacity: [30, [Validators.required, Validators.min(1)]],
  });

  updateForm = this.fb.nonNullable.group({
    id: [0, [Validators.required, Validators.min(1)]],
    title: ['', Validators.required],
  });

  ngOnInit() {
    void this.load();
  }

  async load() {
    this.loading.set(true);
    this.error.set('');
    try {
      // API often uses 1-based page
      const page = this.pageIndex() + 1;
      const res: any = await firstValueFrom(
        this.api.getPage(page, this.pageSize())
      );
      const items = res.items ?? res.data ?? res ?? [];
      this.courses.set(items);
      this.totalCount.set(res.totalCount ?? items.length);
    } catch {
      this.error.set('Failed to load courses.');
    } finally {
      this.loading.set(false);
    }
  }

  onPage(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    void this.load();
  }

  async createCourse() {
    if (this.createForm.invalid) return;
    try {
      await firstValueFrom(this.api.create(this.createForm.getRawValue()));
      this.message.set('Course created.');
      this.createForm.reset({ code: '', title: '', maxCapacity: 30 });
      this.pageIndex.set(0);
      await this.load();
    } catch {
      this.error.set('Create failed.');
    }
  }

  async updateTitle() {
    if (this.updateForm.invalid) return;
    const { id, title } = this.updateForm.getRawValue();
    try {
      await firstValueFrom(this.api.updateTitle(id, title));
      this.message.set(`Course #${id} updated.`);
      await this.load();
    } catch {
      this.error.set('Update failed.');
    }
  }
}