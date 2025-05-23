import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { dataURLtoFile } from '../../utils/file-utils';
import { ImageUploadService } from './image-upload.service';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';


export interface PersonData {
  name: string;
  designation: string;
  message: string;
  imageUrl: string; // base64 for upload, URL for saved data
  id?: number;
  type:string;
}

@Injectable({
  providedIn: 'root'
})
export class PrincipalSecretaryService {
  private baseUrl = '';
  private section = 'principal_secretary';

  constructor(
    private http: HttpClient,
    private imageUploadService: ImageUploadService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    } else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/principal-secretary';
  }

  uploadPerson(data: PersonData, role: 'principal' | 'secretary'): Observable<any> {
    if (!data.imageUrl) {
      return throwError(() => new Error('Image is missing'));
    }

    const imageFile = dataURLtoFile(data.imageUrl);
    if (!imageFile) {
      return throwError(() => new Error('Failed to convert image to file'));
    }

    return this.imageUploadService.uploadImage(imageFile, this.section).pipe(
      switchMap(uploadResponse => {
        const updatedData = { ...data, imageUrl: uploadResponse.url || '', type:role };
        console.log(updatedData);
        return this.http.post(`${this.baseUrl}`, updatedData);
      }),
      catchError(err => {
        console.error(`[${role}] Upload failed`, err);
        return throwError(() => new Error(`${role} upload failed`));
      })
    );
  }

  updatePerson(data: PersonData, role: 'principal' | 'secretary'): Observable<any> {
    console.log("Data:"+data);
    if (!data.imageUrl) {
      return throwError(() => new Error('Image is missing'));
    }
    // If image is base64 (new image), delete old image and upload new one
    if (data.imageUrl.startsWith('data:')) {
      return this.getPerson(role).pipe(
        switchMap(existing => {
          if (Array.isArray(existing) && existing.length > 0 && existing[0]?.imageUrl) {
            console.log("Existing Image URL:", existing.imageUrl);
            return this.imageUploadService.deleteImage(this.section, existing[0]?.imageUrl).pipe(
              catchError(() => of(null)) // Don't fail update if delete fails
            );
          }
          return of(null);
        }),
        switchMap(() => {
          const imageFile = dataURLtoFile(data.imageUrl);
          if (!imageFile) {
            return throwError(() => new Error('Failed to convert image to file'));
          }
          return this.imageUploadService.uploadImage(imageFile, this.section).pipe(
            switchMap(uploadResponse => {
              const updatedData = { ...data, imageUrl: uploadResponse.url || '', type:role };
              return this.http.put(`${this.baseUrl}`, updatedData);
            })
          );
        }),
        catchError(err => {
          console.error(`[${role}] Update failed`, err);
          return throwError(() => new Error(`${role} update failed`));
        })
      );
    }

    // If image is already a URL, just update the record
    return this.http.put(`${this.baseUrl}`, data).pipe(
      catchError(err => {
        console.error(`[${role}] Update failed`, err);
        return throwError(() => new Error(`${role} update failed`));
      })
    );
  }

  getPerson(role: 'principal' | 'secretary'): Observable<PersonData> {
    return this.http.get<PersonData>(`${this.baseUrl}/${role}`);
  }

  deletePerson(id: string, imageUrl: string): Observable<any> {
    return this.imageUploadService.deleteImage(this.section, imageUrl).pipe(
      catchError(() => of(null)), // Image delete failure should not block record delete
      switchMap(() => this.http.delete(`${this.baseUrl}/${id}`)),
      catchError(err => {
        console.error(`[${id}] Delete failed`, err);
        return throwError(() => new Error(`Delete failed for ID: ${id}`));
      })
    );
  }
}
