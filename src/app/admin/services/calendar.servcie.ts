import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import {ImageUploadService, UploadResponse} from './image-upload.service';
import { dataURLtoFile } from '../../utils/file-utils';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';


export interface AcademicCalendarEvent {
  id: number|undefined;
  title: string;
  month: string;
  date: string;
  type: string; // e.g., 'Holiday', 'Event', 'Exam'
}

export interface AcademicCalendarPayload {
  id: number|undefined;
  calendarPdfUrl: string;
  events: AcademicCalendarEvent[];
}

@Injectable({
  providedIn: 'root',
})
export class AcademicCalendarService {
  private baseUrl = '';
  private readonly section = 'academic-calendar';

  constructor(private http: HttpClient, private imageUploadService: ImageUploadService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    }else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/academic-calendar';
  }

  // Save or replace the entire calendar data (PDF + events)
  saveAcademicCalendar(payload: AcademicCalendarPayload): Observable<any> {
    return this.imageUploadService.uploadFile(dataURLtoFile(payload.calendarPdfUrl), this.section).pipe(
      switchMap((uploadedUrl: UploadResponse) => {
        const finalPayload = {
          ...payload,
          calendarPdfUrl: uploadedUrl.url
        };
        return this.http.post(`${this.baseUrl}`, finalPayload);
      })
    );
  }

  // Get calendar data (PDF + events)
  getCalendarData(): Observable<AcademicCalendarPayload> {
    return this.http.get<AcademicCalendarPayload>(`${this.baseUrl}`);
  }

  deleteEvent(id: number, pdfUrl: string): Observable<any> {
    return new Observable(observer => {
      // Step 1: Delete the PDF file from server
      this.imageUploadService.deleteFile(this.section,pdfUrl).subscribe({
        next: () => {
          // Step 2: After PDF is deleted, delete the DB record
          this.http.delete(`${this.baseUrl}/${id}`).subscribe({
            next: res => {
              observer.next(res);
              observer.complete();
            },
            error: err => {
              console.error('Error deleting calendar entry:', err);
              observer.error(err);
            }
          });
        },
        error: err => {
          console.error('Error deleting calendar PDF file:', err);
          observer.error(err);
        }
      });
    });
  }


}
