import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PagedResult, PaginationParams } from '../models/pagination.model';
import {
  ProgramListItem,
  ProgramDetail,
  CreateProgramDto,
  UpdateProgramDto,
} from '../models/program.model';

@Injectable({ providedIn: 'root' })
export class ProgramService {
  private api = inject(ApiService);

  getPrograms(
    params: PaginationParams
  ): Observable<PagedResult<ProgramListItem>> {
    return this.api.get<PagedResult<ProgramListItem>>(
      'programs',
      params
    );
  }

  getProgram(id: string): Observable<ProgramDetail> {
    return this.api.get<ProgramDetail>(`programs/${id}`);
  }

  createProgram(dto: CreateProgramDto): Observable<ProgramDetail> {
    return this.api.post<ProgramDetail>('programs', dto);
  }

  updateProgram(
    id: string,
    dto: UpdateProgramDto
  ): Observable<ProgramDetail> {
    return this.api.put<ProgramDetail>(`programs/${id}`, dto);
  }
}
