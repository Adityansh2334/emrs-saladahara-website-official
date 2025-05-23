import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faUpload,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {
  GeneralGalleryImageUploaderComponent
} from '../../shared/general-gallery-image-uploader/general-gallery-image-uploader.component';
import { ImageUploadService } from '../../services/image-upload.service';
import { firstValueFrom } from 'rxjs';
import {
  AvailableImageShowcaseComponent
} from '../../shared/available-image-showcase/available-image-showcase.component';
import { dataURLtoFile } from '../../../utils/file-utils';
import {ToastService} from '../../services/toast.service';

const MAX_BANNERS = 15;
const SECTION_NAME = 'home_banner';

@Component({
  selector: 'app-homepage-banners-upload',
  templateUrl: './upload-homepage-banners.component.html',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgForOf,
    NgIf,
    GeneralGalleryImageUploaderComponent,
    AvailableImageShowcaseComponent
  ],
  styleUrls: ['./upload-homepage-banners.component.scss']
})
export class HomepageBannersUploadComponent implements OnInit {
  faUpload = faUpload;
  faCheckCircle = faCheckCircle;
  uploadProgress: number[] = []; // Array to track progress for each image
  banners = [{ imageFile: '' }];
  existingBanners: string[] = [];

  // Delete Confirmation Modal
  showDeleteConfirm = false;
  deleteTargetImage: string | null = null;

  constructor(private imageUploadService: ImageUploadService, private toastService: ToastService) {}

  ngOnInit() {
    this.fetchExistingBanners();
  }

  fetchExistingBanners() {
    this.imageUploadService.fetchUploadedImages(SECTION_NAME).subscribe((urls) => {
      this.existingBanners = urls;
    });
  }

  onImageSelected(fileList: File[], index: number): void {
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.banners[index].imageFile = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  onSubmit() {
    const totalBannersAvailable = this.existingBanners.length; // existing + new

    if (totalBannersAvailable >= MAX_BANNERS) {
      this.toastService.error(`Maximum ${MAX_BANNERS} banners allowed. Please delete existing banners before uploading new ones.`);
      return;
    }

    // Check if at least one image is selected
    const hasSelectedImage = this.banners.some(banner => !!banner.imageFile);

    if (!hasSelectedImage) {
      this.toastService.error('Please select at least one image before uploading.');
      return;
    }
    this.uploadProgress = new Array(this.banners.length).fill(0); // reset progress

    const uploadPromises = this.banners.map(async (banner, index) => {
      if (banner.imageFile) {
        const file = dataURLtoFile(banner.imageFile);
        await this.uploadImageToServer(file, index);
        this.banners[index].imageFile = ''; // Clear preview after upload
      }
      return Promise.resolve('');
    });

    Promise.all(uploadPromises)
      .then(() => {
        this.toastService.success('Image uploaded successfully.');
        this.banners = [{ imageFile: '' }];
        this.uploadProgress = [];
        this.fetchExistingBanners();
      })
      .catch(error => {
        this.banners = [{ imageFile: '' }];
        this.uploadProgress = [];
        this.toastService.error(error.message || 'uploads failed.');
      });
  }

  private async uploadImageToServer(file: File, index: number): Promise<string> {
    try {
      const upload$ = this.imageUploadService.uploadImage(file,SECTION_NAME, (progress: number) => {
        this.uploadProgress[index] = progress;
      });

      const response: any = await firstValueFrom(upload$);
      if (response.success) {
        return response.fileName;
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Upload failed');
    }
  }

  // Delete Flow
  onDeleteBanner(imageUrl: string) {
    this.deleteTargetImage = imageUrl;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteTargetImage = null;
  }

  confirmDelete() {
    if (!this.deleteTargetImage) return;

    this.imageUploadService.deleteImage(SECTION_NAME,this.deleteTargetImage).subscribe({
      next: () => {
        this.fetchExistingBanners();
        this.toastService.success('Image deleted successfully.');
        this.showDeleteConfirm = false;
      },
      error: () => {
        this.toastService.error('Failed to delete the image.');
        this.showDeleteConfirm = false;
      }
    });
  }
}
