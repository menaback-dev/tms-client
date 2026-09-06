import { Injectable, Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { environment } from '../../environments/environment';
import { Course, CourseDetail, PagedResponse } from "../models/course.model";



@Injectable({ providedIn: 'root' })
export class CourseService {
    private http = inject(HttpClient);
    private readonly base = `${environment.apiUrl}/v1/courses`;
    private readonly url = `${environment.apiUrl}/courses`;

    getAll() {
        return this.http
        .get<PagedResponse<Course>>(this.base, {
            params: { page: '1', pageSize: '50' },
        })
        .pipe(map((response) => response.items));
    }
    getById(id: string) {
        return this.http.get<CourseDetail>(`${this.base}/${id}`);
    }
    delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
    }

    create(body: { code: string; title: string; maxCapacity: number }) {
    return this.http.post(`${this.url}`, body);
    }

    updateTitle(id: number, title: string) {
    return this.http.put(`${this.base}/${id}`, { title });
    }

    getPage(page: number, pageSize: number) {
    return this.http.get<any>(this.base, {
        params: { page: String(page), pageSize: String(pageSize) },
    });
    }
}
