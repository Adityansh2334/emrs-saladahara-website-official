import {Component, OnInit} from '@angular/core';
import {
  faUpload,
  faEdit,
  faCheckCircle,
  faTimes,
  faChevronUp,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  GeneralGalleryImageUploaderComponent
} from '../../shared/general-gallery-image-uploader/general-gallery-image-uploader.component';
import { ToastService } from '../../services/toast.service';
import {PrincipalSecretaryService} from '../../services/principal-secretary.service';

@Component({
  selector: 'app-upload-principal-secretary',
  templateUrl: './principal-upload.component.html',
  styleUrls: ['./principal-upload.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    FaIconComponent,
    GeneralGalleryImageUploaderComponent
  ]
})
export class PrincipalUploadComponent implements OnInit{
  faUpload = faUpload;
  faEdit = faEdit;
  faCheckCircle = faCheckCircle;
  faTimes = faTimes;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

  principal = { name: '', designation: '', message: '', imageUrl: '' };
  secretary = { name: '', designation: '', message: '', imageUrl: '' };

  principalImage: string | null = null;
  secretaryImage: string | null = null;

  principalData: any = null;
  secretaryData: any = null;

  editingPrincipal = false;
  editingSecretary = false;

  isPrincipalCollapsed = false;
  isSecretaryCollapsed = true;

  isLoading = false;

  editingClicked = false;

  constructor(private toastService: ToastService, private principalSecretaryService: PrincipalSecretaryService) {}

  togglePrincipalCollapse() {
    this.isPrincipalCollapsed = !this.isPrincipalCollapsed;
    if (!this.isPrincipalCollapsed) {
      this.isSecretaryCollapsed = true;
    }
  }

  toggleSecretaryCollapse() {
    this.isSecretaryCollapsed = !this.isSecretaryCollapsed;
    if (!this.isSecretaryCollapsed) {
      this.isPrincipalCollapsed = true;
    }
  }

  onPrincipalImageSelected(event: any): void {
    console.log(event);
    const file = event[0];
    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.principalImage = reader.result as string;
        this.principal.imageUrl = this.principalImage;
      };
      reader.readAsDataURL(file);
    }
  }

  onSecretaryImageSelected(event: any): void {
    const file = event[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.secretaryImage = reader.result as string;
        this.secretary.imageUrl = this.secretaryImage;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadPrincipal(): void {
    if (!this.principal.name || !this.principal.designation || !this.principal.message || !this.principal.imageUrl) {
      this.toastService.error('All fields including image are required for Principal');
      return;
    }
    this.isLoading = true;
    this.principalData = { ...this.principal };
    console.log(this.principalData);
    this.principalSecretaryService.uploadPerson(this.principalData, 'principal').subscribe(  {
      next: () => {
        this.toastService.success('Principal uploaded successfully!');
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to upload Principal');
        this.isLoading = false;
      }
    });
  }

  uploadSecretary(): void {
    if (!this.secretary.name || !this.secretary.designation || !this.secretary.message || !this.secretary.imageUrl) {
      this.toastService.error('All fields including image are required for Secretary');
      return;
    }
    this.isLoading = true;
    this.secretaryData = { ...this.secretary };
    this.principalSecretaryService.uploadPerson(this.secretaryData, 'secretary').subscribe({
      next: () => {
        this.toastService.success('Secretary uploaded successfully!');
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to upload Secretary');
        this.isLoading = false;
      }
    });
  }

  onEdit(role: 'principal' | 'secretary'): void {
    if (role === 'principal') {
      this.editingPrincipal = true;
      this.principal = { ...this.principalData };
      this.toastService.info('Editing Principal details');
    } else {
      this.editingSecretary = true;
      this.secretary = { ...this.secretaryData };
      this.toastService.info('Editing Secretary details');
    }
    this.editingClicked = true;
  }

  cancelEdit(role: 'principal' | 'secretary'): void {
    if (role === 'principal') {
      this.editingPrincipal = false;
      this.toastService.info('Principal edit cancelled');
    } else {
      this.editingSecretary = false;
      this.toastService.info('Secretary edit cancelled');
    }
    this.editingClicked = false;
  }

  savePrincipalEdit(): void {
    if (!this.principal.name || !this.principal.designation || !this.principal.message || !this.principal.imageUrl) {
      this.toastService.error('All fields must be filled before saving Principal changes');
      return;
    }
    this.principalData = { ...this.principal };
    this.editingPrincipal = false;
    console.log(this.principalData);
    console.log(this.principal);
    this.principalSecretaryService.updatePerson(this.principalData, 'principal').subscribe({
      next: () => {
        this.toastService.success('Principal details updated successfully!');
      },
      error: () => {
        this.toastService.error('Failed to update Principal details');
      }
    });
  }

  saveSecretaryEdit(): void {
    if (!this.secretary.name || !this.secretary.designation || !this.secretary.message || !this.secretary.imageUrl) {
      this.toastService.error('All fields must be filled before saving Secretary changes');
      return;
    }
    this.secretaryData = { ...this.secretary };
    this.editingSecretary = false;
    this.principalSecretaryService.updatePerson(this.secretaryData, 'secretary').subscribe({
      next: () => {
        this.toastService.success('Secretary details updated successfully!');
      },
      error: () => {
        this.toastService.error('Failed to update Secretary details');
      }
    });
  }

  fetchPrincipal(): void {
    // Implement logic to fetch the principal's data from the backend
    this.principalSecretaryService.getPerson("principal").subscribe(data => {
      if (Array.isArray(data) && data.length > 0) {
        this.principalData = data[0];
        this.principal = { ...this.principalData };
      } else {
        this.toastService.error("No principal data found");
      }
    });
  }

  fetchSecretary(): void {
    // Implement logic to fetch the secretary's data from the backend
    this.principalSecretaryService.getPerson("secretary").subscribe(data => {
      if (Array.isArray(data) && data.length > 0) {
        this.secretaryData = data[0];
        this.secretary = { ...this.secretaryData };
      } else {
        this.toastService.error("No secretary data found");
      }
    });
  }

  ngOnInit(): void {
    this.fetchPrincipal();
    this.fetchSecretary();
  }
}
