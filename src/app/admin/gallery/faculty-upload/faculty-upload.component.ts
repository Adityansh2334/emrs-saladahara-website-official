import { Component, OnInit } from '@angular/core';
import { FacultyService,Faculty } from '../../services/faculty.service';
import { faUpload, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {FacultyViewerComponent} from '../../shared/faculty-staff-viewer/faculty-staff-viewer.component';
import {FormsModule} from '@angular/forms';
import {
  GeneralGalleryImageUploaderComponent
} from '../../shared/general-gallery-image-uploader/general-gallery-image-uploader.component';

@Component({
  selector: 'app-faculty-upload',
  templateUrl: './faculty-upload.component.html',
  imports: [
    NgIf,
    NgClass,
    FaIconComponent,
    FacultyViewerComponent,
    FormsModule,
    GeneralGalleryImageUploaderComponent,
    NgForOf
  ],
  standalone: true
})
export class UploadFacultyStaffComponent implements OnInit {
  faUpload = faUpload;
  notificationIcon = faCheckCircle;

  facultyList: Faculty[] = [];
  uploadProgress: number[] = [];
  existingFaculty: any[] = [];

  showDeleteConfirm = false;
  confirmedDeleteId: number | null = null;

  showNotification = false;
  notificationMessage = '';
  notificationTitle = '';
  isSuccess = true;
  fileObject: File | null = null;
  oldFileUrl: string | undefined;
  isDeleting = false;
  isLoading = false;

  constructor(private facultyService: FacultyService) {}

  ngOnInit(): void {
    this.addEmptyFacultyEntry();
    this.loadFacultyList();
  }

  addEmptyFacultyEntry(): void {
    this.facultyList = [{
      id: 0,
      name: '',
      designation: '',
      category: '',
      bio: '',
      image: '',
    }];
    this.uploadProgress = [0];
  }

  onImageSelected(files: File[], index: number) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.facultyList[index].image = reader.result as string;
      this.fileObject = file;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(index: number): void {
    const entry = this.facultyList[index];

    if (!entry.name || !entry.designation || !entry.category || !entry.bio || !entry.image) {
      this.showToast('Upload Failed', 'All fields are required.', false);
      return;
    }

    const formData = new FormData();
    formData.append('name', entry.name);
    formData.append('designation', entry.designation);
    formData.append('category', entry.category);
    formData.append('bio', entry.bio);
    formData.append('image', entry.image);
    formData.append("imageFile", this.fileObject!);

    this.uploadProgress[index] = 1;

    this.facultyService.uploadFaculty(formData).subscribe({
      next: () => {
        this.uploadProgress[index] = 100;
        this.showToast('Upload Successful', 'Faculty details uploaded.', true);
        this.addEmptyFacultyEntry();
        this.loadFacultyList();
      },
      error: () => {
        this.uploadProgress[index] = 0;
        this.showToast('Upload Failed', 'Something went wrong.', false);
      }
    });
  }

  loadFacultyList(): void {
    this.isLoading = true;
    this.facultyService.getAllFaculty().subscribe(data => {
      this.existingFaculty = data;
      this.isLoading = false;
    });
  }

  triggerDelete(event: { id: number; image: string }): void {
    this.confirmedDeleteId = event.id;
    this.oldFileUrl = event.image;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (!this.confirmedDeleteId || !this.oldFileUrl) return;
    this.isDeleting = true;
    this.facultyService.deleteFaculty(this.confirmedDeleteId, this.oldFileUrl).subscribe({
      next: () => {
        this.showToast('Deleted Successfully', 'Faculty member deleted.', true);
        this.loadFacultyList();
        this.isDeleting = false;
      },
      error: () => {
        this.showToast('Delete Failed', 'Unable to delete faculty.', false);
        this.isDeleting = false;
      },
      complete: () => {
        this.cancelDelete();
        this.isDeleting = false;
      }
    });
  }

  cancelDelete(): void {
    this.confirmedDeleteId = null;
    this.oldFileUrl = undefined;
    this.showDeleteConfirm = false;
  }

  onSaveEdit(updated: any): void {
    console.error('Updated Faculty Object:', updated);
    const formData = new FormData();
    formData.append('name', updated.name);
    formData.append('designation', updated.designation);
    formData.append('category', updated.category);
    formData.append('bio', updated.bio);
    formData.append('image', updated.image);
    formData.append("id", updated.id);
    console.error('Final FormData contents before PUT:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    this.facultyService.updateFaculty(formData).subscribe({
      next: () => {
        this.showToast('Updated Successfully', 'Faculty details updated.', true);
        this.loadFacultyList();
      },
      error: () => {
        this.showToast('Update Failed', 'Something went wrong.', false);
      }
    });
  }

  showToast(title: string, message: string, success: boolean): void {
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.isSuccess = success;
    this.notificationIcon = success ? faCheckCircle : faExclamationTriangle;
    this.showNotification = true;

    setTimeout(() => this.showNotification = false, 4000);
  }

  closeNotification(): void {
    this.showNotification = false;
  }
}
