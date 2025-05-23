import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, from, Observable, of, switchMap, throwError} from 'rxjs';
import {ImageUploadService, UploadResponse} from './image-upload.service';
import { dataURLtoFile } from '../../utils/file-utils';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';


export interface Hoa {
  id?: number;
  name: string;
  designation: string;
  photo: string;
}
export interface AdminDocument {
  id?: number;
  title: string;
  url: string;
}
@Injectable({ providedIn: 'root' })
export class HallAdminService {
  private baseUrl = '';
  private readonly section = 'hall_of_admin';

  constructor(private http: HttpClient, private imageUploadService: ImageUploadService,
  @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    } else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/hall-of-admin';
}

  uploadHOA(data: Hoa): Observable<any> {
    const file = dataURLtoFile(data.photo);

    return this.imageUploadService.uploadImage(file, this.section).pipe(
      switchMap((res: UploadResponse) => {
        const imageUrl = res?.url;
        if (!imageUrl) {
          throw new Error('Image upload failed: No URL returned.');
        }

        const payload = { ...data, photo: imageUrl };
        return this.http.post(`${this.baseUrl}`, payload);
      }),
      catchError(err => {
        console.error('❌ Failed to upload HOA data:', err);
        return throwError(() => err);
      })
    );
  }

  getHoaById(id: number|undefined): Observable<Hoa> {
    return this.http.get<Hoa>(`${this.baseUrl}/${id}`);
  }

  getHOA(): Observable<Hoa[]> {
    return this.http.get<Hoa[]>(`${this.baseUrl}/all`);
  }

  deleteHOA(id: number, imageUrl: string | null): Observable<any> {
    const deleteData$ = this.http.delete(`${this.baseUrl}/${id}`);

    if (imageUrl) {
      return this.imageUploadService.deleteImage(this.section, imageUrl).pipe(
        switchMap(() => deleteData$),
        catchError(err => {
          console.error('❌ Failed to delete image or record:', err);
          return throwError(() => err);
        })
      );
    }
    return deleteData$.pipe(
      catchError(err => {
        console.error('❌ Failed to delete record:', err);
        return throwError(() => err);
      })
    );
  }

  updateHOA(data: Hoa): Observable<any> {
    const isBase64 = data.photo.startsWith('data:image');

    if (isBase64) {
      const file = dataURLtoFile(data.photo);

      return this.getHoaById(data.id).pipe(
        switchMap((existingData: Hoa) => {
          const oldPhotoUrl = existingData.photo;

          // Delete old image if exists
          const delete$ = oldPhotoUrl
            ? this.imageUploadService.deleteImage(this.section, oldPhotoUrl)
            : of(null);

          return delete$.pipe(
            switchMap(() =>
              this.imageUploadService.uploadImage(file, this.section)
            ),
            switchMap((res: UploadResponse) => {
              const imageUrl = res?.url;
              if (!imageUrl) {
                throw new Error('Image upload failed: No URL returned.');
              }

              const payload = { ...data, photo: imageUrl };
              return this.http.put(`${this.baseUrl}`, payload);
            })
          );
        }),
        catchError(err => {
          console.error('❌ Failed to update HOA with image replacement:', err);
          return throwError(() => err);
        })
      );
    }

    // No new image uploaded, just update the rest of the data
    return this.http.put(`${this.baseUrl}`, data).pipe(
      catchError(err => {
        console.error('❌ Failed to update HOA (no image upload):', err);
        return throwError(() => err);
      })
    );
  }

  deleteHoaDocument(id: number, fileUrl: string): Observable<any> {
    return from(this.imageUploadService.deleteFile(this.section, fileUrl)).pipe(
      switchMap(() =>this.http.delete(`${this.baseUrl}/hoa-documents/${id}`)),
      catchError((error) => {
        console.error('Error deleting hoa docs:', error);
        return throwError(() => new Error('Failed to delete hoa docs.'));
      })
    );
  }

  getHoaDocuments(): Observable<AdminDocument[]> {
    return this.http.get<AdminDocument[]>(`${this.baseUrl}/hoa-documents`);
  }

  createHoaDocument(data: AdminDocument, file: File): Observable<any> {
    return this.imageUploadService.uploadFile(file,this.section).pipe(
      switchMap((imageUrl: UploadResponse) => {
        const payload: AdminDocument = {
          ...data,
          url: imageUrl.url||'',
        };
        return this.http.post(`${this.baseUrl}/hoa-documents`, payload);
      }),
      catchError((err) => {
        console.error('Document creation failed:', err);
        return throwError(() => err);
      })
    );
  }
}
