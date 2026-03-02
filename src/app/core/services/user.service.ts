import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserDetail {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export interface UserPreference {
  language?: string;
  timezone?: string;
  darkMode?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getCurrentUser(): Observable<UserDetail> {
    return this.api.get<UserDetail>('users/me');
  }

  updatePreferences(
    userId: string,
    preferences: UserPreference
  ): Observable<void> {
    return this.api.put<void>(`users/${userId}/preferences`, preferences);
  }
}
