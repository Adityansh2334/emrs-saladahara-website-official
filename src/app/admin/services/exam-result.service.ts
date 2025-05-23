import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, switchMap, catchError, throwError } from 'rxjs';
import { ImageUploadService, UploadResponse } from './image-upload.service';
import { dataURLtoFile } from '../../utils/file-utils';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';


export interface CompletedExamResult {
  name: string;
  classLevel: string;
  date: string;
  resultUrl: string;
  id?: number;
}

@Injectable({ providedIn: 'root' })
export class ExamResultService {
  private baseUrl = '';
  private readonly section = 'exam-results';

  constructor(
    private http: HttpClient,
    private imageUploadService: ImageUploadService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    }else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/exam-results';
  }

  /** Upload PDF file, then save exam result metadata */
  uploadResults(results: CompletedExamResult[]): Observable<any> {
    try {
      const file = dataURLtoFile(results[0].resultUrl);
      return from(this.imageUploadService.uploadFile(file, this.section)).pipe(
        switchMap((uploadedUrl: UploadResponse) => {
          const updatedPayload = {
            ...results[0],
            resultUrl: uploadedUrl.url,
          };
          return this.http.post(`${this.baseUrl}`, [updatedPayload]);
        }),
        catchError((error) => {
          console.error('Error uploading exam result:', error);
          return throwError(() => new Error('Failed to upload exam result.'));
        })
      );
    } catch (conversionError) {
      console.error('File conversion failed:', conversionError);
      return throwError(() => new Error('Invalid file data.'));
    }
  }

  /** Fetch saved exam results from backend */
  getResults(): Observable<CompletedExamResult[]> {
    return this.http.get<CompletedExamResult[]>(`${this.baseUrl}`).pipe(
      catchError((error) => {
        console.error('Error fetching exam results:', error);
        return throwError(() => new Error('Failed to load exam results.'));
      })
    );
  }

  /** Delete PDF file first, then DB entry */
  deleteResult(id: number, resultUrl: string): Observable<any> {
    return from(this.imageUploadService.deleteFile(this.section, resultUrl)).pipe(
      switchMap(() => this.http.delete(`${this.baseUrl}/${id}`)),
      catchError((error) => {
        console.error('Error deleting exam result:', error);
        return throwError(() => new Error('Failed to delete exam result.'));
      })
    );
  }
}
