import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PagedResult, PaginationParams } from '../models/pagination.model';
import {
  MovementListView,
  MovementDetail,
  CreateMovementDto,
  UpdateMovementDto,
} from '../models/movement.model';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private api = inject(ApiService);

  getMovements(
    params: PaginationParams
  ): Observable<PagedResult<MovementListView>> {
    return this.api.get<PagedResult<MovementListView>>(
      'movements/list-view',
      params
    );
  }

  getMovement(id: string): Observable<MovementDetail> {
    return this.api.get<MovementDetail>(`movements/${id}`);
  }

  createMovement(dto: CreateMovementDto): Observable<MovementDetail> {
    return this.api.post<MovementDetail>('movements', dto);
  }

  updateMovement(
    id: string,
    dto: UpdateMovementDto
  ): Observable<MovementDetail> {
    return this.api.put<MovementDetail>(`movements/${id}`, dto);
  }

  deleteMovement(id: string): Observable<void> {
    return this.api.delete<void>(`movements/${id}`);
  }
}
