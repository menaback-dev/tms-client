import { Component, effect, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../models/enrollment.model';
import { EnrollmentService } from '../../services/enrollment.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'tms-admin-enrollments',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './admin-enrollments.component.html',
  styleUrl: './admin-enrollments.component.scss',
})
export class AdminEnrollmentsComponent {
  store = inject(EnrollmentStore);
  private api = inject(EnrollmentService);

  displayedColumns = ['studentName', 'courseName', 'status', 'actions'];
  dataSource = new MatTableDataSource<Enrollment>([]);

  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);

  filterText = '';
  deleteStudentId = '';
  actionMessage = '';
  actionError = '';

  constructor() {
    effect(() => {
      this.dataSource.data = this.store.entities();
    });

    effect(() => {
      const p = this.paginator();
      const s = this.sort();
      this.dataSource.paginator = p;
      this.dataSource.sort = s;

      this.dataSource.sortingDataAccessor = (row, column) => {
        switch (column) {
          case 'studentName':
            return (row.studentName || row.studentId || '').toString().toLowerCase();
          case 'courseName':
            return (row.courseName || row.courseCode || '').toString().toLowerCase();
          case 'status':
            return (row.status || 'Pending').toString().toLowerCase();
          default:
            return (row as any)[column];
        }
      };

      this.dataSource.filterPredicate = (row, filter) => {
        const q = filter.trim().toLowerCase();
        if (!q) return true;
        return [
          row.studentName,
          row.studentId,
          row.courseName,
          row.courseCode,
          row.status,
        ]
          .map((v) => (v ?? '').toString().toLowerCase())
          .some((v) => v.includes(q));
      };
    });

    this.store.loadEnrollments();
  }

  applyFilter(value: string) {
    this.filterText = value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  async approve(id: string | number) {
    this.actionMessage = '';
    this.actionError = '';
    try {
      // Prefer store method if it calls API + patches state
      await this.store.approveEnrollment(id as any);
      this.actionMessage = `Enrollment ${id} approved.`;
    } catch {
      this.actionError = 'Approve failed.';
    }
  }

  async deleteByStudentId() {
    this.actionMessage = '';
    this.actionError = '';
    const studentId = this.deleteStudentId.trim();
    if (!studentId) return;

    const row = this.store.entities().find((e) => String(e.studentId) === studentId);
    if (!row) {
      this.actionError = 'No enrollment found for that registration / student id.';
      return;
    }

    try {
      await firstValueFrom(this.api.delete(row.id));
      this.actionMessage = `Deleted enrollment for ${studentId}.`;
      this.deleteStudentId = '';
      this.store.loadEnrollments();
    } catch {
      this.actionError = 'Delete failed.';
    }
  }
}