import { computed, inject } from "@angular/core";
import {
    signalStore,
    withComputed,
    withMethods,
    patchState,
    withState,
} from '@ngrx/signals'
import { withEntities, setAllEntities, updateEntity } from "@ngrx/signals/entities";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, concatMap, tap, catchError, EMPTY } from "rxjs";
import { EnrollmentService } from "../services/enrollment.service";
import { Enrollment } from "../models/enrollment.model";
import { LiveSyncService } from '../services/live-sync.service';
import { switchMap } from 'rxjs';



export const EnrollmentStore = signalStore(
    { providedIn: 'root' },
    withState({isLoading: false, error: null as string | null}),

    withEntities<Enrollment>(),

    withComputed((store) => ({
        pendingCount: computed(
            () => store.entities().filter(e => e.status === 'Pending').length
        ),
    })),

    withMethods((store, api = inject(EnrollmentService), sync = inject(LiveSyncService)) => ({
        loadEnrollments: rxMethod<void>(
            pipe(
                tap(() => patchState(store, {isLoading: true, error: null})),
                concatMap(() =>
                api.getAll().pipe(
                    tap(rows => patchState(store, setAllEntities(rows), { isLoading: false})),
                    catchError(err => {
                        patchState(store, { isLoading: false, error: err.message});
                        return EMPTY;
                    })
                ))
            )
        ),

        approveEnrollment: rxMethod<string>(
            pipe(
                tap(id => {
                    patchState(store, updateEntity({ id, changes: { status: 'Approved' }}));  
                }),
                concatMap(id => 
                    api.approve(id).pipe(
                        catchError(err => {
                            patchState(store, updateEntity({ id, changes: { status: 'Pending'} }));
                            patchState(store, { error: 'Server rejected the approval. Check enrollment constraints.'});
                            return EMPTY;
                        })
                    )
                )
            )
        ),

        listenForLiveUpdates: rxMethod<void>(
        pipe(
        tap(() => sync.connect()),
        switchMap(() => sync.events$),
        tap((event) => {
        const entities = store.entities();
        const match = entities.find(e => String(e.id) === String(event.id));
        if (!match) {
            console.warn('No entity found for', event.id, entities.map(e => e.id));
            return;
        }
            patchState(
            store,
            updateEntity({
                id: match.id,
                changes: { status: event.status },
            })
            );
        })
        )
    ),
    }))
);