import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, from, map, Observable, switchMap, of, catchError, throwError, tap} from 'rxjs';
import {ImageUploadService, UploadResponse} from './image-upload.service';
import { dataURLtoFile } from '../../utils/file-utils';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';

export interface GeneralGallery {
  id?: string;
  title: string;
  coverImage: string;
  images: string[]; // internally this is string[], but backend expects [{ imageUrl }]
}

@Injectable({
  providedIn: 'root',
})
export class GeneralGalleryService {
  private baseUrl = '';

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
    this.baseUrl = this.baseUrl + '/api/gallery';
  }

  private isBase64 = (url: string): boolean => url?.startsWith('data:image');

  // 🔼 Create new gallery
  uploadGallery(gallery: GeneralGallery): Observable<any> {

    // Cover image upload logic
    const coverImage$: Observable<string> = this.isBase64(gallery.coverImage)
      ? this.imageUploadService
        .uploadImage(dataURLtoFile(gallery.coverImage), 'gallery')
        .pipe(
          map((res) => res.url as string),
          catchError((err) => {
            console.error('❌ Cover image upload failed:', err);
            return throwError(() => err);
          })
        )
      : of(gallery.coverImage);

    // Separate base64 and non-base64 images
    const base64Images = gallery.images.filter((img) => this.isBase64(img));
    const nonBase64Images = gallery.images.filter((img) => !this.isBase64(img));

    const base64Files: File[] = base64Images.map((img, index) =>
      dataURLtoFile(img)
    );
    const imageUploads$: Observable<string[]> = base64Files.length
      ? this.imageUploadService.uploadMultipleImages(base64Files, 'gallery').pipe(
        map((responses: UploadResponse[]) => {
          // Extracting 'files' from the response, which contains the list of uploaded images
          const uploadedUrls = responses?.map((res: UploadResponse) => res.url || '') || [];
          return [...nonBase64Images, ...uploadedUrls];
        }),
        catchError((err) => {
          console.error('❌ Image upload failed:', err);
          return throwError(() => err);
        })
      )
      : of(nonBase64Images);

    return forkJoin([coverImage$, imageUploads$]).pipe(
      switchMap(([coverImageUrl, imageUrls]: [string, string[]]) => {
        const payload = {
          ...gallery,
          coverImage: coverImageUrl,
          images: imageUrls.map((url) => ({ imageUrl: url }))
        };
        console.log("Payload:", payload);
        return this.http.post(`${this.baseUrl}`, payload).pipe(
          catchError((err) => {
            console.error('❌ Failed to upload gallery to backend:', err);
            return throwError(() => err);
          })
        );
      })
    );
  }

  updateGallery(
    updatedGallery: GeneralGallery,
    oldCoverImage: string,
    oldImages: string[]
  ): Observable<any> {
    console.log("Updating gallery:", updatedGallery);
    console.log("Old cover image:", oldCoverImage);
    console.log("Old images:", oldImages);

    const isCoverImageUpdated = this.isBase64(updatedGallery.coverImage);

    const coverImage$: Observable<string> = isCoverImageUpdated
      ? this.imageUploadService.uploadImage(dataURLtoFile(updatedGallery.coverImage), 'gallery').pipe(
        tap(() => {
          if (oldCoverImage) {
            this.imageUploadService.deleteImage('gallery', oldCoverImage).subscribe();
          }
        }),
        map(res => res.url as string),
        catchError(err => {
          console.error('❌ Cover image upload failed:', err);
          return throwError(() => err);
        })
      )
      : of(updatedGallery.coverImage);
    console.log("updatedGalllery:", updatedGallery);
    const base64Images = updatedGallery.images.filter(img => this.isBase64(img));
    const nonBase64Images = updatedGallery.images.filter(img => !this.isBase64(img));
    const base64Files: File[] = base64Images.map(dataURLtoFile);
    console.log("base64Images Update:", base64Files);
    const deletedImages = oldImages.filter(img => !updatedGallery.images.includes(img));

    let imageUploads$: Observable<string[]>;

    if (base64Files.length > 0) {
      // Upload new base64 images first, then delete old ones
      imageUploads$ = this.imageUploadService.uploadMultipleImages(base64Files, 'gallery').pipe(
        map((res: UploadResponse[]) => res?.map((file: UploadResponse) => file.url || '') || []),
        map((uploadedUrls) => [...nonBase64Images, ...uploadedUrls]),
        tap(() => {
          if (deletedImages.length) {
            forkJoin(deletedImages.map(url => this.imageUploadService.deleteImage('gallery', url)))
              .subscribe({
                next: () => console.log('🗑️ Deleted all old images'),
                error: err => console.error('❌ Error deleting images', err)
              });
          }
        }),
        catchError(err => {
          console.error('❌ Image upload failed:', err);
          return throwError(() => err);
        })
      );
    } else if (deletedImages.length > 0) {
      // Only deletions
      deletedImages.forEach(url => {
        this.imageUploadService.deleteImage('gallery', url).subscribe();
      });

      imageUploads$ = of(nonBase64Images); // No uploads, only return retained images
    } else {
      // No changes
      imageUploads$ = of(updatedGallery.images);
    }

    return forkJoin([coverImage$, imageUploads$]).pipe(
      switchMap(([coverImageUrl, imageUrls]) => {
        const payload: any = {
          ...updatedGallery,
          coverImage: coverImageUrl,
          images: imageUrls.map((url) => ({ imageUrl: url }))
        };
        console.log("Payload:", payload);
        return this.http.put(`${this.baseUrl}/${updatedGallery.id}`, payload).pipe(
          catchError(err => {
            console.error('❌ Failed to update gallery:', err);
            return throwError(() => err);
          })
        );
      })
    );
  }


  // 📥 Fetch all galleries
  getAllGalleries(): Observable<GeneralGallery[]> {
    return this.http.get<GeneralGallery[]>(`${this.baseUrl}`).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        console.error('❌ Failed to fetch galleries:', err);
        return throwError(() => err);
      })
    );
  }

  // Delete Gallery
  deleteGallery(id: string): Observable<any> {

    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      switchMap((galleryData) => {
        const galleries = Array.isArray(galleryData) ? galleryData : [galleryData];

        const imageUrls: string[] = galleries.flatMap((gallery) => {
          const urls = [];
          if (gallery.coverImage) {
            urls.push(gallery.coverImage);
          }
          if (Array.isArray(gallery.images)) {
            urls.push(...gallery.images.map((img: any) => img?.imageUrl ?? ''));
          }
          return urls;
        });

        const validUrls = imageUrls.filter(Boolean);

        const deleteRequests = validUrls.map((url, index) =>
          this.imageUploadService.deleteImage('gallery', url).pipe(
            catchError((err) => {
              console.error(`❌ Failed to delete image ${index + 1}:`, err);
              return of(null); // allow other deletions to continue
            })
          )
        );

        return forkJoin(deleteRequests).pipe(
          switchMap(() => {
            return this.http.delete(`${this.baseUrl}/${id}`);
          }),
          catchError((err) => {
            console.error('❌ Failed to delete gallery entry:', err);
            return throwError(() => err);
          })
        );
      }),
      catchError((err) => {
        console.error('❌ Failed to fetch gallery for deletion:', err);
        return throwError(() => err);
      })
    );
  }

}
