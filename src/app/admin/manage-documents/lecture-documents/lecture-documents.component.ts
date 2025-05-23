import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTrash, faDownload, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { LectureNoteService } from '../../services/lecture-note.service';
import { ToastService } from '../../services/toast.service';
import {TableLoaderComponent} from '../../shared/table-loader/table-loader.component';

interface Document {
  id: number;
  subject: string;
  date: string;
  fileUrl?: string;
  classLevel: string;
  size: string;
}

@Component({
  selector: 'app-lecture-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, TableLoaderComponent],
  templateUrl: './lecture-documents.component.html',
  styleUrls: ['./lecture-documents.component.scss']
})
export class LectureDocumentsComponent implements OnInit {
  filterText = '';
  newSubjectTitle = '';
  classLevel = '';
  selectedFile: File | null = null;
  fileSize = '';
  loading = false;
  isDeleting = false;
  isUploading = false;

  documents: Document[] = [];
  showDeleteConfirm = false;
  deleteDocId: number | null = null;
  oldFileUrl: string | undefined;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private lectureNoteService: LectureNoteService,
    private toastService: ToastService,
    library: FaIconLibrary
  ) {
    library.addIcons(faTrash, faDownload, faFileUpload);
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadDocuments();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredDocuments.length / this.itemsPerPage);
  }

  paginatedDocuments() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return this.filteredDocuments.slice(start, end);
  }

  changePage(direction: number) {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  get filteredDocuments() {
    return this.documents.filter(doc =>
      doc.subject.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
    this.fileSize = this.selectedFile ? (this.selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB' : '';
  }

  uploadDocument() {
    const levelNum = Number(this.classLevel);

    if (!this.classLevel || isNaN(levelNum)) {
      this.toastService.error('Class level is required.');
      return;
    }

    if (levelNum < 1 || levelNum > 12) {
      this.toastService.error('Class level must be between 1 and 12.');
      return;
    }
    if (!this.newSubjectTitle.trim() || !this.selectedFile) {
      this.toastService.error('Title and PDF file are required.');
      return;
    }
    this.isUploading = true;
    const formData = new FormData();
    formData.append('subject', this.newSubjectTitle.trim());
    formData.append('file', this.selectedFile);
    formData.append('size', this.fileSize);
    formData.append('date', new Date().toISOString());
    formData.append('classLevel', this.classLevel);

    this.lectureNoteService.uploadDocument(formData).subscribe({
      next: (doc) => {
        this.documents.unshift(doc);
        this.newSubjectTitle = '';
        this.selectedFile = null;
        this.isUploading = false;
        this.toastService.success('Document uploaded successfully.');
      },
      error: () => {
        this.toastService.error('Failed to upload document.');
        this.isUploading = false;
      }
    });
  }

  confirmDelete(id: number, fileUrl: string|undefined) {
    this.deleteDocId = id;
    this.showDeleteConfirm = true;
    this.oldFileUrl = fileUrl;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteDocId = null;
  }

  deleteDocument(id: number | null, fileUrl: string | undefined) {
    if (!id || !fileUrl) return;

    this.isDeleting = true;
    this.lectureNoteService.deleteDocument(id, fileUrl).subscribe({
      next: () => {
        this.documents = this.documents.filter(doc => doc.id !== id);
        this.toastService.success('Document deleted.');
        this.isDeleting = false;
        this.cancelDelete();
      },
      error: () => {
        this.toastService.error('Failed to delete document.')
        this.isDeleting = false;
        this.cancelDelete();
      }
    });
  }

  private loadDocuments() {
    this.lectureNoteService.getAllDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Failed to load documents.');
        this.loading = false;
      }
    });
  }
}
