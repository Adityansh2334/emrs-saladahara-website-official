import { Component, OnInit } from '@angular/core';
import { AssignmentService, Assignment } from '../../services/assignment.service';
import { ToastService } from '../../services/toast.service';
import { faPlusCircle, faTrashAlt, faUpload, faListAlt, faFilePdf, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-assignment-upload',
  templateUrl: './assignments-upload.component.html',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./assignments-upload.component.scss']
})
export class AssignmentUploadComponent implements OnInit {
  // FontAwesome icons
  faPlusCircle = faPlusCircle;
  faTrashAlt = faTrashAlt;
  faUpload = faUpload;
  faListAlt = faListAlt;
  faFilePdf = faFilePdf;
  faFileAlt = faFileAlt;


  // Form input model
  newAssignment: Assignment = this.getEmptyAssignment();
  classOptions: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  // Component state
  selectedFileDataUrl: string = '';
  stagedAssignments: Assignment[] = [];
  savedAssignments: Assignment[] = [];
  uploading = false;
  minDate = new Date();
  showDeleteConfirm = false;
  deleteAssignmentId = 0;
  deleteAssignmentFileUrl = '';
  isLoadingAssignments = false;
  isDeleting = false;

  constructor(
    private assignmentService: AssignmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchSavedAssignments();
  }

  getEmptyAssignment(): Assignment {
    return {
      classLevel: '',
      subject: '',
      title: '',
      teacher: '',
      dueDate: '',
      fileUrl: ''
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.toastService.error('Only PDF files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFileDataUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  addAssignmentLocally(): void {
    if (!this.isFormValid()) {
      this.toastService.error('All fields and PDF file are required.');
      return;
    }

    const assignmentToAdd: Assignment = {
      ...this.newAssignment,
      fileUrl: this.selectedFileDataUrl
    };

    this.stagedAssignments.push(assignmentToAdd);
    this.toastService.success('Assignment added locally.');

    this.resetForm();
  }

  isFormValid(): boolean {
    const { classLevel: classLevel, subject, title, teacher, dueDate } = this.newAssignment;
    return !!(classLevel && subject && title && teacher && dueDate && this.selectedFileDataUrl);
  }

  resetForm(): void {
    this.newAssignment = this.getEmptyAssignment();
    this.selectedFileDataUrl = '';
  }

  removeStagedAssignment(index: number): void {
    this.stagedAssignments.splice(index, 1);
    this.toastService.success('Assignment removed from staging.');
  }

  uploadStagedAssignments(): void {
    if (!this.stagedAssignments.length) {
      this.toastService.error('No assignments to upload.');
      return;
    }

    this.uploading = true;

    this.assignmentService.uploadAssignments(this.stagedAssignments).subscribe({
      next: () => {
        this.toastService.success('Assignments uploaded successfully.');
        this.stagedAssignments = [];
        this.fetchSavedAssignments();
        this.uploading = false;
      },
      error: () => {
        this.toastService.error('Upload failed. Please try again.');
        this.uploading = false;
      }
    });
  }

  fetchSavedAssignments(): void {
    this.isLoadingAssignments = true;
    this.assignmentService.getAssignments().subscribe({
      next: (res: Assignment[]) => {
        this.savedAssignments = res;
        this.isLoadingAssignments = false;
      },
      error: () => {
        this.toastService.error('Failed to load assignments.');
        this.isLoadingAssignments = false;
      }
    });
  }

  confirmDeleteResult(): void {
    if (!this.deleteAssignmentId || !this.deleteAssignmentFileUrl) return;
    this.isDeleting = true;
    this.assignmentService.deleteAssignment(this.deleteAssignmentId, this.deleteAssignmentFileUrl).subscribe({
      next: () => {
        this.toastService.success('Assignment deleted.');
        this.showDeleteConfirm = false;
        this.deleteAssignmentId = 0;
        this.deleteAssignmentFileUrl = '';
        this.fetchSavedAssignments();
        this.isDeleting = false;
      },
      error: () => {
        this.toastService.error('Failed to delete assignment.');
        this.showDeleteConfirm = false;
        this.deleteAssignmentId = 0;
        this.deleteAssignmentFileUrl = '';
        this.isDeleting = false;
      }
    });
  }

  confirmDelete(id: number|undefined, fileUrl: string){
    if (!id) return;
    this.deleteAssignmentId = id;
    this.showDeleteConfirm = true;
    this.deleteAssignmentFileUrl = fileUrl;
  }

  cancelDelete(){
    this.showDeleteConfirm = false;
    this.deleteAssignmentId = 0;
    this.deleteAssignmentFileUrl = '';
  }

}
