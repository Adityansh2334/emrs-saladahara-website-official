import {Component, OnInit} from '@angular/core';
import { faUpload, faTrash, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { GeneralGalleryService } from '../../services/general-gallery.service';
import { ToastService } from '../../services/toast.service';
import { NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { GeneralGalleryViewerComponent } from '../../shared/general-gallery-viewer/general-gallery-viewer.component';

interface GeneralGallery {
  id?: string;
  title: string;
  coverImage: string;
  images: string[];
}

@Component({
  selector: 'app-general-gallery-upload',
  templateUrl: './general-gallery-upload.component.html',
  standalone: true,
  imports: [
    NgIf,
    FaIconComponent,
    NgForOf,
    FormsModule,
    GeneralGalleryViewerComponent
  ],
  styleUrls: ['./general-gallery-upload.component.scss']
})
export class GeneralGalleryUploadComponent implements OnInit {
  // FontAwesome Icons
  faUpload = faUpload;
  faTrash = faTrash;
  faTimes = faTimes;
  faSave = faSave;

  // Upload form fields
  title = '';
  coverImage: string | null = null;
  galleryImages: string[] = [];
  coverImageName: string | null = null;
  isDeleting = false;
  isLoading = false;
  isUploading = false;

  // Gallery viewer
  galleries: GeneralGallery[] = [];

  // Validation error flags
  coverImageError = false;
  galleryImagesError = false;

  // Edit mode tracking
  isEditMode = false;
  selectedGallery: GeneralGallery | null = null;

  // Delete confirmation modal variables
  deleteConfirmationVisible: boolean = false;
  deleteImageIndex: number | null = null;

  //for Edits
  editGalleryNewImageFiles: File[] = [];
  coverImageFile : File | null = null;
  editCoverImageName: string | null = null;

  //Hold the images to be deleted, If images available
  imagesToDelete: { [galleryId: number]: string[] } = {}; // Tracks old gallery images to delete per gallery
  coverImageToDelete: { [galleryId: number]: string } = {}; // Tracks old cover images to delete

  private maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes

  constructor(
    private galleryService: GeneralGalleryService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.fetchGalleries();
  }

  // ==== COVER IMAGE ====
  onCoverImageSelected(event: any) {
    const file = event.target.files?.[0];
    if (file && file.size > this.maxFileSize) {
      this.coverImageError = true;
      return;
    }
    if (file) {
      this.coverImageName = file.name;
      const reader = new FileReader();
      reader.onload = () => this.coverImage = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  // ==== GALLERY IMAGES ====
  onGalleryImagesSelected(event: any) {
    const files = event.target.files;
    if ((this.galleryImages.length + files.length) > 10) {
      this.toastService.error('Maximum 10 images allowed in a gallery.');
      return;
    }
    this.galleryImagesError = false;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > this.maxFileSize) {
        this.galleryImagesError = true;
        break;
      }
    }
    if (this.galleryImagesError) return;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = () => this.galleryImages.push(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onCoverImageReplace(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this.editCoverImageName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        if (this.selectedGallery) {
          this.selectedGallery.coverImage = reader.result as string;
          this.coverImageFile = file; // Save for backend update
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onEditGalleryImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && this.selectedGallery) {
      const selectedFiles = Array.from(input.files);
      const availableSlots = 10 - this.selectedGallery.images.length;

      if (selectedFiles.length > availableSlots) {
        this.toastService.error(`You can only upload ${availableSlots} more image(s).`);
        return;
      }

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedGallery?.images.push(reader.result as string);
          this.editGalleryNewImageFiles.push(file);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeCoverImage() {
    this.coverImage = null;
  }

  removeGalleryImage(index: number) {
    this.galleryImages.splice(index, 1);
  }

  // ==== UPLOAD ====
  uploadGallery() {
    if (!this.title.trim() || !this.coverImage || this.galleryImages.length === 0) {
      this.toastService.error('Please fill in all required fields.');
      return;
    }
    this.isUploading = true;
    const payload: GeneralGallery = {
      title: this.title,
      coverImage: this.coverImage,
      images: this.galleryImages
    };

    this.galleryService.uploadGallery(payload).subscribe({
      next: () => {
        this.toastService.success('Gallery uploaded successfully.');
        this.resetForm();
        this.fetchGalleries();
        this.isUploading = false;
      },
      error: () => {
        this.toastService.error('Upload failed. Try again.');
        this.isUploading = false;
      }
    });
  }

  resetForm() {
    this.title = '';
    this.coverImage = null;
    this.coverImageName = null;
    this.galleryImages = [];
    this.isEditMode = false;
    this.selectedGallery = null;
    this.coverImageError = false;
    this.galleryImagesError = false;
  }

  // ==== VIEWER ====
  fetchGalleries() {
    this.isLoading = true;
    this.galleryService.getAllGalleries().subscribe({
      next: (data) => {
        this.galleries = data
        this.isLoading = false;
        if (this.galleries.length) {
          this.galleries.forEach(gallery => {
            const galleryId = Number(gallery.id);
            if (!isNaN(galleryId)) {
              this.coverImageToDelete[galleryId] = gallery.coverImage;
              this.imagesToDelete[galleryId] = [...gallery.images];
            }
          });

          console.log("✅ Images to be deleted:", this.imagesToDelete);
          console.log("✅ Cover images to be deleted:", this.coverImageToDelete);
        } else {
          console.log("⚠️ No galleries available.");
          this.toastService.info('No galleries available.');
          this.isLoading = false;
        }
      },
      error: () => this.toastService.error('Failed to load galleries.')
    });
  }

  // ==== EDIT MODE ====
  openEditModal(gallery: GeneralGallery) {
    if (this.isEditMode) {
      this.toastService.info('Finish editing the current gallery first.');
      return;
    }

    this.selectedGallery = JSON.parse(JSON.stringify(gallery)); // Deep clone
    this.isEditMode = true;
  }

  saveGalleryEdit() {
    if (!this.selectedGallery?.title.trim() || !this.selectedGallery.coverImage) {
      this.toastService.error('Title and cover image are required.');
      return;
    }
    const galleryId = Number(this.selectedGallery.id);
    const oldCover = this.coverImageToDelete[galleryId];
    const oldImgs = this.imagesToDelete[galleryId];

    this.galleryService.updateGallery(this.selectedGallery,oldCover,oldImgs).subscribe({
      next: () => {
        this.toastService.success('Gallery updated successfully.');
        this.cancelEdit();
        this.fetchGalleries();
      },
      error: () => this.toastService.error('Failed to update gallery.')
    });
  }

  // ==== DELETE GALLERY IMAGE ====
  openDeleteConfirmation(index: number) {
    this.deleteConfirmationVisible = true;
    this.deleteImageIndex = index;
  }

  cancelDeleteConfirmation() {
    this.deleteConfirmationVisible = false;
    this.deleteImageIndex = null;
  }

  deleteGalleryImage(deleteImageIndex: number | null) {
    if (this.selectedGallery && deleteImageIndex !== null) {
      this.selectedGallery.images.splice(deleteImageIndex, 1);
      this.toastService.success('Image deletion added successfully.');
      this.cancelDeleteConfirmation();
    }
  }

  cancelEdit() {
    this.selectedGallery = null;
    this.isEditMode = false;
  }
}
