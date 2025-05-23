import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ToastService } from '../../services/toast.service';
import { GeneralGalleryService } from '../../services/general-gallery.service';

@Component({
  selector: 'app-general-gallery-viewer',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './general-gallery-viewer.component.html',
  styleUrls: ['./general-gallery-viewer.component.scss'],
})
export class GeneralGalleryViewerComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;

  @Input() galleries: any[] = [];  // Galleries passed from parent
  @Output() editGallery = new EventEmitter<any>(); // Event emitter to notify the parent component about edit

  currentPage = 1;
  itemsPerPage = 4;

  deleteConfirmationVisible = false;
  deleteImageIndex: number | 0 = 0;
  isDeleting = false;

  constructor(
    private galleryService: GeneralGalleryService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Fetch galleries from service if no input is provided.
    if (!this.galleries || this.galleries.length === 0) {
      // this.fetchGalleries();
    }
  }

  fetchGalleries(): void {
    this.galleryService.getAllGalleries().subscribe({
      next: (data) => {
        this.galleries = data;
      },
      error: () => {
        this.toastService.error('Failed to load galleries');
      }
    });
  }

  get paginatedGalleries(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.galleries.slice(start, start + this.itemsPerPage);
  }

  deleteGallery(index: number): void {
    this.deleteImageIndex = index;
    this.deleteConfirmationVisible = true;
  }

  deleteGalleryImage(): void {
    this.isDeleting = true;
    const gallery = this.paginatedGalleries[this.deleteImageIndex];
      this.galleryService.deleteGallery(gallery.id).subscribe({
        next: () => {
          this.toastService.success('Gallery deleted successfully');
          this.fetchGalleries();
          this.isDeleting = false;
        },
        error: () => {
          this.toastService.error('Failed to delete gallery');
          this.isDeleting = false;
        }
      });
    this.cancelDeleteConfirmation();
  }

  cancelDeleteConfirmation(): void {
    this.deleteConfirmationVisible = false;
    this.deleteImageIndex = 0;
  }

  editGalleryAction(index: number): void {
    const gallery = this.paginatedGalleries[index];
    this.toastService.info(`Trigger edit mode for "${gallery.title}"`);
    this.editGallery.emit(gallery);  // Emit the gallery to the parent for editing
  }

  totalPages(): number {
    return Math.ceil(this.galleries.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }
}
