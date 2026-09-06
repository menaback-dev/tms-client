import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';
import { environment } from '../../environments/environment';

export interface CreateEnrollmentRequest {
  studentId: string;
  courseCode: string;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private http = inject(HttpClient);

  /** Match Scalar: POST /api/enrollments */
  private readonly baseUrl = `${environment.apiUrl}/enrollments`;
  // or: `${environment.apiUrl}/enrollments` if that already includes /api

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.baseUrl);
  }

  approve(id: number | string): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.baseUrl}/${id}/approve`, {});
  }

  /** Scalar: { studentId, courseCode } */
  enroll(request: CreateEnrollmentRequest): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.baseUrl, request);
  }

  /** Delete by enrollment id OR adapt to your API */
  delete(id: number | string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** If API deletes by student registration number: */
  deleteByStudentId(studentId: string) {
    return this.http.delete<void>(`${this.baseUrl}/by-student/${encodeURIComponent(studentId)}`);
  }
}