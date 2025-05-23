import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, from, throwError, forkJoin, map} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { dataURLtoFile } from '../../utils/file-utils';
import { ImageUploadService, UploadResponse } from './image-upload.service';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';


export interface Assignment {
  classLevel: string;
  subject: string;
  title: string;
  teacher: string;
  dueDate: string;
  fileUrl: string;
  id?: number;
}

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private baseUrl = '';
  private readonly section = 'assignment-exams';

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
    this.baseUrl = this.baseUrl+'/api/assignment-exams';
  }

  /** Upload each assignment file first, then save data to DB */
  uploadAssignments(assignments: Assignment[]): Observable<any> {
    const uploadTasks = assignments.map((assignment, index) => {
      const file = dataURLtoFile(assignment.fileUrl);

      return from(this.imageUploadService.uploadFile(file, this.section)).pipe(
        map((res: UploadResponse) => {
          return {
            ...assignment,
            fileUrl: res.url || ''
          };
        }),
        catchError((err) => {
          console.error(`Upload failed for assignment #${index + 1}:`, err);
          throw new Error(`Failed to upload file for: ${assignment.title || 'Untitled Assignment'}`);
        })
      );
    });

    return forkJoin(uploadTasks).pipe(
      switchMap((finalAssignments: Assignment[]) => {
        return this.http.post(this.baseUrl, finalAssignments);
      }),
      catchError((err) => {
        console.error('Saving assignments failed:', err);
        return throwError(() => new Error('Uploading one or more assignments failed. Please try again.'));
      })
    );
  }

  /** Fetch all saved assignments */
  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.baseUrl);
  }

  /** Delete assignment file from storage first, then from DB */
  deleteAssignment(id: number, fileUrl: string): Observable<any> {
    return from(this.imageUploadService.deleteFile(this.section, fileUrl)).pipe(
      switchMap(() => this.http.delete(`${this.baseUrl}/${id}`)),
      catchError((err) => {
        console.error('Delete failed:', err);
        return throwError(() => err);
      })
    );
  }
}
