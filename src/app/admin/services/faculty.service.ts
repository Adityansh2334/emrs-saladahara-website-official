// faculty.service.ts
import { HttpClient } from '@angular/common/http';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ImageUploadService} from './image-upload.service';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import { dataURLtoFile } from '../../utils/file-utils';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';


export interface Faculty {
  id: number;
  name: string;
  image: string;
  designation: string;
  category: string;
  bio: string;
}

@Injectable({ providedIn: 'root' })
export class FacultyService {
  private baseUrl = ''; // Spring Boot API endpoint
  private readonly section = 'faculty';

  constructor(private http: HttpClient,
              private imageUploadService: ImageUploadService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    } else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/faculty';
  }

  // ---------------- Upload Faculty ----------------
  uploadFaculty(formData: FormData): Observable<any> {
    const imageFile = formData.get('imageFile') as File;

    return this.imageUploadService.uploadImage(imageFile, this.section).pipe(
      switchMap(uploadResponse => {
        formData.set('image', uploadResponse.url || '');
        return this.http.post(`${this.baseUrl}`, this.parseFormData(formData));
      }),
      catchError(err => {
        console.error('Faculty upload failed', err);
        return throwError(() => new Error('Faculty upload failed'));
      })
    );
  }

  // ---------------- Update Faculty ----------------
  updateFaculty(formData: FormData): Observable<any> {
    const id = formData.get('id') as string;
    const base64Image = formData.get('image') as string;

    // Case: New base64 image detected (needs upload)
    if (base64Image?.startsWith('data:')) {
      const file = dataURLtoFile(base64Image);

      // First, get existing faculty to delete the old image
      return this.getFacultyById(+id).pipe(
        switchMap(existing => {
          const oldImageUrl = existing.image;
          return this.imageUploadService.deleteImage(this.section, oldImageUrl);
        }),
        switchMap(() => this.imageUploadService.uploadImage(file, this.section)),
        switchMap(uploadResponse => {
          formData.set('image', uploadResponse.url || '');
          return this.http.put(`${this.baseUrl}`, this.parseFormData(formData));
        })
      );
    }

    // Case: No new image, just update other fields
    return this.http.put(`${this.baseUrl}`, this.parseFormData(formData));
  }


  // ---------------- Get All Faculty ----------------
  getAllFaculty(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getFacultyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // ---------------- Delete Faculty ----------------
  deleteFaculty(id: number, imageUrl: string): Observable<any> {
    return this.imageUploadService.deleteImage(this.section, imageUrl).pipe(
      switchMap(() => this.http.delete(`${this.baseUrl}/${id}`)),
      catchError(err => {
        console.error('Faculty delete failed', err);
        return throwError(() => new Error('Faculty delete failed'));
      })
    );
  }

  private parseFormData(formData: FormData): any {
    const faculty: any = {
      name: formData.get('name'),
      designation: formData.get('designation'),
      category: formData.get('category'),
      bio: formData.get('bio'),
      image: formData.get('image')
    };

    // If updating, also include the id
    const id = formData.get('id');
    if (id) {
      faculty.id = id;
    }

    console.log('Parsed Faculty Object:', faculty);
    return faculty;
  }
}
