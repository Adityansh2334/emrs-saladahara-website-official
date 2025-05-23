import { Component } from '@angular/core';
import { HallAdminService, Hoa } from '../../services/hall-admin.service';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '../../services/toast.service';
import {
  GeneralGalleryImageUploaderComponent
} from '../../shared/general-gallery-image-uploader/general-gallery-image-uploader.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {HallAdminViewerComponent} from '../../shared/hall-admin-viewer/hall-admin-viewer.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-hall-admin-upload',
  templateUrl: './hall-admin-upload.component.html',
  imports: [
    GeneralGalleryImageUploaderComponent,
    FaIconComponent,
    NgIf,
    HallAdminViewerComponent,
    FormsModule
  ],
  standalone: true
})
export class HallAdminUploadComponent {
  faUpload = faUpload;

  name = '';
  designation = '';
  imageUrlEdit = '';
  imageUrl = '';
  imageError = false;
  deleteConfirmationVisible = false;
  deleteHoaIndex: number|undefined = undefined;
  imageUrlOld: string|null = null;
  modalSelectedFileName: string | null = null;
  modalUploadDisabled = false;
  modalImageSizeError = false;
  isLoading = false;
  isDeleting = false;
  isLoadingData = false;


  hoaList: Hoa[] = [];

  editingItem: Hoa|null = null;

  constructor(
    private hallAdminService: HallAdminService,
    private toast: ToastService
  ) {
    this.fetchHOA();
  }

  startEdit(item: Hoa) {
    this.editingItem = { ...item }; // clone to avoid live mutation
  }

  cancelEdit() {
    this.editingItem = null;
  }

  onModalFileSelected(event: Event, input: HTMLInputElement): void {
    const file = input.files?.[0];

    if (file) {
      // File size check: 2MB = 2 * 1024 * 1024
      if (file.size > 2 * 1024 * 1024) {
        this.modalImageSizeError = true;
        this.modalSelectedFileName = null;
        this.imageUrlEdit = '';
        return;
      }

      this.modalImageSizeError = false;
      this.modalSelectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrlEdit = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveEdit() {
    // const { id, name, designation, photo } = this.editingItem;
    if(!this.editingItem) return;

    if(this.imageUrlEdit) {
      this.editingItem.photo = this.imageUrlEdit;
    }
    if (!this.editingItem.name.trim() || !this.editingItem.designation.trim() || !this.editingItem.photo) {
      this.toast.error('All fields including photo are required.');
      return;
    }

    this.hallAdminService.updateHOA(this.editingItem).subscribe({
      next: () => {
        this.toast.success('Entry updated successfully.');
        this.fetchHOA();
        this.cancelEdit();
      },
      error: () => this.toast.error('Failed to update entry.')
    });
  }

  onImageSelected(files: File[], index: number) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submitHOA() {
    if (!this.name.trim() || !this.designation.trim() || !this.imageUrl) {
      this.imageError = !this.imageUrl;
      this.toast.error('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;
    const data: Hoa = {
      name: this.name,
      designation: this.designation,
      photo: this.imageUrl,
    };

    this.hallAdminService.uploadHOA(data).subscribe({
      next: () => {
        this.toast.success('Hall of Administration entry uploaded successfully.');
        this.resetForm();
        this.fetchHOA();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to upload entry.');
        this.isLoading = false;
      }
    });
  }

  resetForm() {
    this.name = '';
    this.designation = '';
    this.imageUrl = '';
    this.imageError = false;
    this.modalSelectedFileName = '';
    this.imageUrlEdit = '';
  }

  fetchHOA() {
    this.isLoadingData = true;
    this.hallAdminService.getHOA().subscribe({
      next: (res) => {
        this.hoaList = res
        this.isLoadingData = false;
      },
      error: () => {
        this.toast.error('Failed to load entries.')
        this.isLoadingData = false;
      }
    });
  }

  deleteHOA() {
    if(!this.deleteHoaIndex) return;
    this.isDeleting = true;
    this.hallAdminService.deleteHOA(this.deleteHoaIndex, this.imageUrlOld).subscribe({
      next: () => {
        this.toast.success('Entry deleted successfully.');
        this.fetchHOA();
        this.isDeleting = false;
        this.deleteConfirmationVisible = false;
      },
      error: () => {
        this.toast.error('Failed to delete entry.')
        this.isDeleting = false;
      }
    });
  }

  cancelDeleteConfirmation() {
    this.deleteConfirmationVisible = false;
    this.deleteHoaIndex = undefined;
  }

  onDelete(event:{id: number|undefined, image: string}) {
    if (!event.id) return;
    this.deleteHoaIndex = event.id; // deleteHoaIndex
    this.imageUrlOld = event.image;
    this.deleteConfirmationVisible = true;
  }
}
