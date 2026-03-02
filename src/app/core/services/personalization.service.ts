import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Personalization,
  UserPersonalization,
} from '../models/personalization.model';

@Injectable({ providedIn: 'root' })
export class PersonalizationService {
  private api = inject(ApiService);

  getPersonalizations(): Observable<Personalization[]> {
    return this.api.get<Personalization[]>('personalization');
  }

  getMyPersonalizations(): Observable<UserPersonalization[]> {
    return this.api.get<UserPersonalization[]>('personalization/me');
  }

  getUserPersonalizations(
    userId: string
  ): Observable<UserPersonalization[]> {
    return this.api.get<UserPersonalization[]>(
      `personalization/user/${userId}`
    );
  }
}
