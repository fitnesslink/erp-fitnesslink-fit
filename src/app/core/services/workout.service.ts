import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PagedResult, PaginationParams } from '../models/pagination.model';
import {
  WorkoutListItem,
  WorkoutDetail,
  CreateWorkoutDto,
  UpdateWorkoutDto,
} from '../models/workout.model';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private api = inject(ApiService);

  getWorkouts(
    params: PaginationParams
  ): Observable<PagedResult<WorkoutListItem>> {
    return this.api.get<PagedResult<WorkoutListItem>>(
      'workouts',
      params
    );
  }

  getWorkout(id: string): Observable<WorkoutDetail> {
    return this.api.get<WorkoutDetail>(`workouts/${id}`);
  }

  getWorkoutsByContributor(
    contributorId: string
  ): Observable<PagedResult<WorkoutListItem>> {
    return this.api.get<PagedResult<WorkoutListItem>>(
      `workouts/contributor/${contributorId}`
    );
  }

  createWorkout(dto: CreateWorkoutDto): Observable<WorkoutDetail> {
    return this.api.post<WorkoutDetail>('workouts', dto);
  }

  updateWorkout(
    id: string,
    dto: UpdateWorkoutDto
  ): Observable<WorkoutDetail> {
    return this.api.put<WorkoutDetail>(`workouts/${id}`, dto);
  }

  deleteWorkout(id: string): Observable<void> {
    return this.api.delete<void>(`workouts/${id}`);
  }
}
