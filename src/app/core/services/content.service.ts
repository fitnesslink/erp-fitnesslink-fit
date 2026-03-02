import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface BlobUploadResult {
  id: string;
  url: string;
  fileName: string;
}

export interface FavoriteContent {
  id: string;
  contentId: string;
  contentType: string;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private api = inject(ApiService);

  uploadFile(file: File): Observable<BlobUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload<BlobUploadResult>('content/upload', formData);
  }

  favoriteContent(contentId: string): Observable<void> {
    return this.api.post<void>(`content/favorites/${contentId}`, {});
  }

  getFavorites(): Observable<FavoriteContent[]> {
    return this.api.get<FavoriteContent[]>('content/favorites');
  }
}
