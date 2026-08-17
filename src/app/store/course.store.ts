import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { catchError, EMPTY } from 'rxjs';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withState({ error: null as string | null }),
  withEntities<Course>(),
  withMethods((store, svc = inject(CourseService)) => ({
    loadCourses() {
      svc.getAll().subscribe((items) => {
        patchState(store, setAllEntities(items));
      });
    },

    deleteCourse(id: number) {
      // 1) Snapshot BEFORE mutation
      const previousSnapshot = store.entities();

      // 2) Optimistic remove
      patchState(store, removeEntity(id));
      patchState(store, { error: null });

      // 3) API call
      svc.delete(id).pipe(
        catchError(() => {
          // 4) Rollback
          patchState(store, setAllEntities(previousSnapshot));
          patchState(store, {
            error: 'Cannot delete course: active student enrollments exist.',
          });
          return EMPTY;
        })
      ).subscribe();
    },
  }))
);