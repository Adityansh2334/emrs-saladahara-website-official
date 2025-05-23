import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {ImageUploadService} from './image-upload.service';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';


interface Document {
  id: number;
  name: string;
  uploadedDate: string;
  fileUrl?: string;
  size: string;
}

@Injectable({ providedIn: 'root' })
export class NoticeService {
  private baseUrl = ''; // change accordingly
  private readonly section = 'notices';

  constructor(private http: HttpClient, private imageUploadService: ImageUploadService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    } else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/notices';
  }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}`);
  }

  uploadDocument(data: FormData): Observable<Document> {
    const name = data.get('name') as string;
    const size = data.get('size') as string;
    const uploadedDate = data.get('uploadedDate') as string;
    const file = data.get('file') as File;

    if (!file || !name || !size || !uploadedDate ) {
      console.error('[Notice] Missing required fields in FormData');
      return throwError(() => new Error('Incomplete form data'));
    }

    return this.imageUploadService.uploadFile(file, this.section).pipe(
      switchMap((uploadResponse) => {
        if (!uploadResponse?.url) {
          console.error('[Notice] File upload failed');
          return throwError(() => new Error('File upload failed'));
        }

        const payload = {
          name,
          size,
          uploadedDate,
          fileUrl: uploadResponse.url
        };

        return this.http.post<Document>(this.baseUrl, payload);
      }),
      catchError((err) => {
        console.error('[Notice] Upload error:', err);
        return throwError(() => new Error('Failed to upload lecture note'));
      })
    );
  }

  deleteDocument(id: number, fileUrl:string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { params: { fileUrl } });
  }
}
