import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, map, filter } from 'rxjs';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';

export interface UploadResponse {
  success: boolean;
  message: string;
  fileName?: string;
  url?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private  baseUrl = '';

  constructor(private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    } else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/upload';
  }

  // -------------------- IMAGE METHODS --------------------

  uploadImage(file: File, section: string, progressCb?: (percent: number) => void): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/image/${section}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && progressCb) {
          const percent = Math.round(100 * (event.loaded / (event.total || 1)));
          progressCb(percent);
        } else if (event.type === HttpEventType.Response) {
          return event.body as UploadResponse;
        }
        return null;
      }),
      filter(res => res !== null)
    );
  }

  uploadMultipleImages(files: File[], section: string): Observable<UploadResponse[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<UploadResponse[]>(`${this.baseUrl}/images/${section}`, formData);
  }

  fetchUploadedImages(section: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/images/${section}`);
  }

  deleteImage(section: string, imageUrl: string): Observable<any> {
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    return this.http.delete(`${this.baseUrl}/media/${section}/${filename}`);
  }

  // -------------------- FILE METHODS --------------------

  uploadFile(file: File, section: string, progressCb?: (percent: number) => void): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/file/${section}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && progressCb) {
          const percent = Math.round(100 * (event.loaded / (event.total || 1)));
          progressCb(percent);
        } else if (event.type === HttpEventType.Response) {
          return event.body as UploadResponse;
        }
        return null;
      }),
      filter(res => res !== null)
    );
  }

  uploadMultipleFiles(files: File[], section: string): Observable<UploadResponse[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<UploadResponse[]>(`${this.baseUrl}/files/${section}`, formData);
  }

  fetchUploadedFiles(section: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/files/${section}`);
  }

  deleteFile(section: string, fileUrl: string): Observable<any> {
    const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    return this.http.delete(`${this.baseUrl}/file/${section}/${filename}`);
  }
}
