import {
  faUpload,
  faPlus,
  faTrashAlt,
  faCloudUploadAlt,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Component } from '@angular/core';
import { ExamResultService, CompletedExamResult } from '../../services/exam-result.service';
import { ToastService } from '../../services/toast.service';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss'],
  imports: [
    FaIconComponent,
    NgForOf,
    FormsModule,
    NgIf
  ],
  standalone: true
})
export class ExamResultsComponent {
  faUpload = faUpload;
  faPlus = faPlus;
  faTrashAlt = faTrashAlt;
  faCloudUploadAlt = faCloudUploadAlt;
  faListAlt = faListAlt;

  newResult: CompletedExamResult = {
    name: '',
    classLevel: '',
    date: '',
    resultUrl: '',
  };

  tempFilename: string = "";
  selectedFileName: string = "Select File";
  selectedFileUrl: string = "";
  isLoadingResults: boolean = false;
  isDeleting: boolean = false;
  maxdate: string = new Date().toISOString().split('T')[0];

  classOptions: number[] = Array.from({ length: 12 }, (_, i) => i + 1);


  pendingResults: CompletedExamResult[] = [];
  savedResults: CompletedExamResult[] = [];
  showDeleteConfirm: boolean = false;
  deleteTargetId: number | null = null;
  deleteTargetUrl: string | null = null;

  constructor(
    private resultService: ExamResultService,
    private toast: ToastService
  ) {
    this.fetchSavedResults();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length) {
      const file = fileInput.files[0];
      this.selectedFileName = file.name;
      this.tempFilename = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addResultLocally() {
    if (!this.newResult.name || !this.newResult.classLevel || !this.newResult.date || !this.selectedFileName) {
      this.toast.error('Please fill all fields and upload a result file.');
      return;
    }

    const classNum = parseInt(this.newResult.classLevel!, 10);
    if (isNaN(classNum) || classNum < 1 || classNum > 12) {
      this.toast.error('Class must be between 1 and 12.');
      return;
    }

    this.pendingResults.push({
      name: this.newResult.name!,
      classLevel: this.newResult.classLevel!,
      date: this.newResult.date!,
      resultUrl: this.selectedFileUrl,
    });

    this.newResult = {
      name: '',
      classLevel: '',
      date: '',
      resultUrl: '',
    };
    this.selectedFileName = "Select File";
    this.selectedFileUrl = "";
  }

  removePendingResult(index: number) {
    this.pendingResults.splice(index, 1);
  }

  uploadResults() {
    this.resultService.uploadResults(this.pendingResults).subscribe({
      next: () => {
        this.toast.success('Results uploaded successfully.');
        this.pendingResults = [];
        this.fetchSavedResults();
      },
      error: () => {
        this.toast.error('Failed to upload results.');
      },
    });
  }

  fetchSavedResults() {
    this.isLoadingResults = true;
    this.resultService.getResults().subscribe({
      next: (data) => {
        this.savedResults = data;
        this.isLoadingResults = false;
      },
      error: () => {
        this.toast.error('Failed to fetch saved results.');
        this.isLoadingResults = false;
      },
    });
  }

  confirmDeleteResult() {
    if (!this.deleteTargetId || !this.deleteTargetUrl) return;
    this.isDeleting = true;
      this.resultService.deleteResult(this.deleteTargetId, this.deleteTargetUrl).subscribe({
        next: () => {
          this.toast.success('Result deleted.');
          this.showDeleteConfirm = false;
          this.deleteTargetId = null;
          this.deleteTargetUrl = null;
          this.isDeleting = false;
          this.fetchSavedResults();
        },
        error: () => {
          this.toast.error('Deletion failed.');
          this.showDeleteConfirm = false;
          this.deleteTargetId = null;
          this.isDeleting = false;
          this.deleteTargetUrl = null;
        },
      });
  }

  deleteResult(id: number, resultUrl: string) {
    this.showDeleteConfirm = true;
    this.deleteTargetId = id;
    this.deleteTargetUrl = resultUrl;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteTargetId = null;
    this.deleteTargetUrl = null;
  }

}
