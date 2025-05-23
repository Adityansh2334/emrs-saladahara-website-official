import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, firstValueFrom, catchError, throwError, of} from 'rxjs';
import { ImageUploadService } from './image-upload.service';
import { map, switchMap } from 'rxjs/operators';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';

export interface Achievement {
  id?: number;
  title: string;
  coverImage: string; // Full image URL
  description: string;
  section: 'general' | 'sports' | 'science'; // <-- Added
}

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private imageUploadService: ImageUploadService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      this.apiUrl = global.API_URL.trim(); // SSR context
    } else {
      this.apiUrl = environment.apiUrl; // Browser context
    }
    this.apiUrl = this.apiUrl + '/api/achievements';
  }

  /**
   * Fetch achievements by section.
   */
  async fetchAchievements(section: 'general' | 'sports' | 'science' = 'general'): Promise<Achievement[]> {
    try {
      const data = await firstValueFrom(
        this.http.get<Achievement[]>(`${this.apiUrl}/section/${section}`)
      );
      return data || [];
    } catch {
      console.error("Error Occurred while fetching achievements");
      return [];
    }
  }

  /**
   * Uploads an image and returns the full image URL.
   */
  uploadImage(file: File, achievement: Omit<Achievement, 'coverImage'>): Observable<string> {
    let section = achievement.section === 'general' ? 'achievement' : achievement.section;
    return this.imageUploadService.uploadImage(file, section).pipe(
      map((res) => {
        if (res.success && res.url) {
          return res.url;
        }
        throw new Error('Image upload failed');
      })
    );
  }

  /**
   * Save a new achievement entry with uploaded image.
   */
  saveAchievementWithImage(
    file: File,
    achievement: Omit<Achievement, 'coverImage'>
  ): Observable<any> {
    return this.uploadImage(file,achievement).pipe(
      switchMap((imageUrl) => {
        const payload: Achievement = {
          ...achievement,
          coverImage: imageUrl,
        };
        return this.http.post(`${this.apiUrl}`, payload);
      })
    );
  }

  /**
   * Update existing achievement.
   */
  updateAchievement(achievement: Achievement): Observable<any> {
    return this.http.put(`${this.apiUrl}`, achievement);
  }

  getAchievementById(id: number): Observable<Achievement> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Delete a specific achievement by ID.
   */
  deleteAchievement(id: number, imageUrl: string, section: string): Observable<any> {
    if(section === 'general') section = 'achievement';
    const getImageUrl$ = imageUrl
      ? of(imageUrl)
      : this.getAchievementById(id).pipe(
        map((achievement) => achievement.coverImage || ''),
        catchError(err => {
          console.error(`Failed to fetch achievement with ID ${id}`, err);
          return throwError(() => new Error('Unable to retrieve achievement image for deletion.'));
        })
      );

    return getImageUrl$.pipe(
      switchMap((finalImageUrl) => {
        if (finalImageUrl) {
          return this.imageUploadService.deleteImage(section, finalImageUrl);
        }
        return of(null); // No image to delete
      }),
      switchMap(() => this.http.delete(`${this.apiUrl}/${id}`)),
      catchError(err => {
        console.error(`Achievement delete failed for section: ${section}`, err);
        return throwError(() => new Error(`Achievement delete failed for section: ${section}`));
      })
    );
  }

}
