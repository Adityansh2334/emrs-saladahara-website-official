import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { ImageUploadService } from './image-upload.service';
import { dataURLtoFile } from '../../utils/file-utils';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';

export interface AdmissionDetails {
  id: number;
  applicationFileUrl: string;
  contact: {
    phone: string;
    email: string;
    phoneType: string;
    emailType: string;
  };
  eligibility: string[];
  documentsRequired: string[];
  importantDates: { event: string; date: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {
  private baseUrl = '';
  private readonly section = 'admission';

  constructor(private http: HttpClient, private imageUploadService: ImageUploadService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    } else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/admissions';
  }

  getAdmissionDetails(): Observable<AdmissionDetails> {
    return this.http.get<AdmissionDetails>(`${this.baseUrl}`);
  }

  saveAdmissionDetails(formData: FormData): Observable<any> {
    const metadataBlob = formData.get('metadata') as Blob;

    if (!metadataBlob) {
      console.error('[Admission] Metadata blob is missing in FormData.');
      return throwError(() => new Error('Metadata is missing from formData.'));
    }

    return from(metadataBlob.text()).pipe(
      switchMap((json) => {

        let metadata: AdmissionDetails;
        try {
          metadata = JSON.parse(json);
        } catch (err) {
          console.error('[Admission] Failed to parse metadata JSON:', err);
          return throwError(() => new Error('Failed to parse metadata JSON.'));
        }

        if (!metadata.applicationFileUrl) {
          console.error('[Admission] No application file URL found in metadata.');
          return throwError(() => new Error('Application file URL is missing in metadata.'));
        }

        const applicationFile = dataURLtoFile(metadata.applicationFileUrl);

        return this.imageUploadService.uploadFile(applicationFile, this.section).pipe(
          switchMap((uploadResponse) => {
            if (!uploadResponse || !uploadResponse.url) {
              console.error('[Admission] File upload failed or returned no URL.');
              return throwError(() => new Error('File upload failed.'));
            }

            metadata.applicationFileUrl = uploadResponse.url;

            return this.http.post(`${this.baseUrl}`, metadata);
          }),
          catchError((uploadError) => {
            console.error('[Admission] Error during file upload:', uploadError);
            return throwError(() => new Error('File upload failed.'));
          })
        );
      }),
      catchError((metaError) => {
        console.error('[Admission] Error processing metadata:', metaError);
        return throwError(() => new Error('Failed to process admission data.'));
      })
    );
  }

  updateAdmissionDetails(formData: FormData): Observable<any> {
    const metadataBlob = formData.get('metadata') as Blob;
    const existingFileUrl = formData.get('existingImageUrl') as string;

    if (!metadataBlob) {
      console.error('[Admission] Metadata blob is missing in FormData.');
      return throwError(() => new Error('Metadata is missing from formData.'));
    }

    return from(metadataBlob.text()).pipe(
      switchMap((json) => {
        let metadata: AdmissionDetails;
        try {
          metadata = JSON.parse(json);
        } catch (err) {
          console.error('[Admission] Failed to parse metadata JSON:', err);
          return throwError(() => new Error('Failed to parse metadata JSON.'));
        }

        const isBase64 = metadata.applicationFileUrl?.startsWith('data:');

        if (!isBase64) {
          // No new file uploaded, just update existing metadata
          return this.http.post(`${this.baseUrl}`, metadata);
        }

        // A new file was uploaded — delete existing file, upload new one, then update
        return this.imageUploadService.deleteFile(this.section, existingFileUrl).pipe(
          switchMap(() => {
            const newFile = dataURLtoFile(metadata.applicationFileUrl);
            return this.imageUploadService.uploadFile(newFile, this.section);
          }),
          switchMap((uploadResponse) => {
            if (!uploadResponse || !uploadResponse.url) {
              return throwError(() => new Error('File upload failed during update.'));
            }

            metadata.applicationFileUrl = uploadResponse.url;
            return this.http.post(`${this.baseUrl}`, metadata);
          }),
          catchError((err) => {
            console.error('[Admission] Error in delete or upload:', err);
            return throwError(() => new Error('Failed during file replacement in update.'));
          })
        );
      }),
      catchError((metaErr) => {
        console.error('[Admission] Metadata processing error:', metaErr);
        return throwError(() => new Error('Failed to process admission update metadata.'));
      })
    );
  }

}
