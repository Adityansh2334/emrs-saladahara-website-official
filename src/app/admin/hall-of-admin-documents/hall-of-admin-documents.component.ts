import { Component, OnInit } from '@angular/core';
import { HallAdminService, AdminDocument } from '../services/hall-admin.service';
import { faTrash, faUpload, faFile } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '../services/toast.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hall-admin-documents',
  standalone: true,
  imports: [FaIconComponent, NgIf, NgForOf, FormsModule],
  templateUrl: './hall-of-admin-documents.component.html'
})
export class HallAdminDocumentsComponent implements OnInit {
  faTrash = faTrash;
  faUpload = faUpload;
  faFile = faFile;

  title: string = '';
  file: File | null = null;
  isUploading = false;
  isLoadingDocs = false;
  isDeleting = false;
  deleteTargetId: number | null = null;
  documents: AdminDocument[] = [];
  showDeleteConfirm: boolean = false;
  deleteFileUrl: string = '';

  constructor(
    private docService: HallAdminService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoadingDocs = true;
    this.docService.getHoaDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.isLoadingDocs = false;
      },
      error: () => {
        this.toast.error('Failed to load documents.');
        this.isLoadingDocs = false;
      }
    });
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }

  upload(): void {
    if (!this.title || !this.file) {
      this.toast.error('Title and PDF file are required.');
      return;
    }

    const data: AdminDocument = {
      title: this.title,
      url: ''
    };

    this.isUploading = true;
    this.docService.createHoaDocument(data, this.file).subscribe({
      next: () => {
        this.toast.success('Document uploaded successfully.');
        this.title = '';
        this.file = null;
        this.isUploading = false;
        this.loadDocuments();
      },
      error: () => {
        this.toast.error('Failed to upload document.');
        this.isUploading = false;
      }
    });
  }

  delete(id: number, url: string): void {
    this.deleteTargetId = id;
    this.deleteFileUrl = url;
    this.showDeleteConfirm = true;
  }

  deleteHoa(): void {
    if (this.deleteTargetId === null || this.deleteFileUrl === '') return;

    this.isDeleting = true;
    this.docService.deleteHoaDocument(this.deleteTargetId, this.deleteFileUrl).subscribe({
      next: () => {
        this.toast.success('Document deleted successfully.');
        this.isDeleting = false;
        this.showDeleteConfirm = false;
        this.loadDocuments();
      },
      error: () => {
        this.toast.error('Failed to delete document.');
        this.isDeleting = false;
        this.showDeleteConfirm = false;
      }
    });
  }

  cancelDelete(): void {
    this.deleteTargetId = null;
    this.showDeleteConfirm = false;
  }
}
