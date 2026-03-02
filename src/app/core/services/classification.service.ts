import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Anatomy,
  Equipment,
  TrainingLevel,
  ContentStatus,
  RpeScale,
} from '../models/classification.model';

@Injectable({ providedIn: 'root' })
export class ClassificationService {
  private api = inject(ApiService);

  getAnatomy(): Observable<Anatomy[]> {
    return this.api.get<Anatomy[]>('classification/anatomy');
  }

  getEquipment(): Observable<Equipment[]> {
    return this.api.get<Equipment[]>('classification/equipment');
  }

  getTrainingLevels(): Observable<TrainingLevel[]> {
    return this.api.get<TrainingLevel[]>('classification/training-levels');
  }

  getContentStatuses(): Observable<ContentStatus[]> {
    return this.api.get<ContentStatus[]>('classification/content-statuses');
  }

  getRpeScales(): Observable<RpeScale[]> {
    return this.api.get<RpeScale[]>('classification/rpe-scales');
  }
}
