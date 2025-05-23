import { Component, OnInit } from '@angular/core';
import { AdmissionService, AdmissionDetails } from '../../services/admission.service';
import { ToastService } from '../../services/toast.service';
import { faPlus, faEdit, faPhone,faCheck, faCheckCircle, faTimesCircle, faFileAlt, faCalendarAlt, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admission-upload',
  templateUrl: './admission-upload.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FaIconComponent,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./admission-upload.component.scss']
})
export class AdmissionUploadComponent implements OnInit {

  // FontAwesome icons
  faPlus = faPlus;
  faCheck = faCheck;
  faEdit = faEdit;
  faPhone = faPhone;
  faCheckCircle = faCheckCircle;
  faFileAlt = faFileAlt;
  faCalendarAlt = faCalendarAlt;
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  faTimesCircle = faTimesCircle;

  // Modal control flags
  showEligibilityModal = false;
  showDocumentModal = false;
  showDateModal = false;
  showUpdateConfirm = false;

  // Form data
  admission: AdmissionDetails = {
    id: 0,
    applicationFileUrl: '',
    contact: { phone: '', email: '', phoneType: 'Admission', emailType: 'Admission' },
    eligibility: [''],
    documentsRequired: [''],
    importantDates: [{ event: '', date: '' }]
  };

  applicationFileUrl: string = '';
  existingApplicationFileUrl: string = '';
  showUploadForm = true;
  uploadedFile: File | null = null;
  uploadedFileName: string = '';
  isEditMode = false;
  isLoading = false;
  isLoadingAdmissionInfo = false;
  existingAdmission: AdmissionDetails | null = null;
  fileSizeError = false;

  // Modal form fields
  newEligibility: string | undefined;
  newDocument: string | undefined;
  newDate: { event: string; date: string } = { event: '', date: '' };

  constructor(
    private admissionService: AdmissionService,
    private toast: ToastService)
  {}

  ngOnInit(): void {
    this.fetchAdmissionData();
  }

  // ========= Modals =========
  openEligibilityModal() { this.newEligibility = ''; this.showEligibilityModal = true; }
  closeEligibilityModal() { this.showEligibilityModal = false; }


  addEligibility() {
    if (this.newEligibility?.trim()) {
      if(this.admission.eligibility.length == 1 && this.admission.eligibility[0].trim() == '') {
        this.admission.eligibility = [];
      }
      this.admission.eligibility.push(this.newEligibility.trim());
      this.closeEligibilityModal();
    }
  }
  removeEligibility(index: number) {
    this.admission.eligibility.splice(index, 1);
  }

  openDocumentModal() { this.newDocument = ''; this.showDocumentModal = true; }
  closeDocumentModal() { this.showDocumentModal = false; }
  addDocument() {
    if (this.newDocument?.trim()) {
      if(this.admission.documentsRequired.length == 1 && this.admission.documentsRequired[0].trim() == '') {
        this.admission.documentsRequired = [];
      }
      this.admission.documentsRequired.push(this.newDocument.trim());
      this.closeDocumentModal();
    }
  }
  removeDocument(index: number) {
    this.admission.documentsRequired.splice(index, 1);
  }

  openDateModal() { this.newDate = { event: '', date: '' }; this.showDateModal = true; }
  closeDateModal() { this.showDateModal = false; }
  addImportantDate() {
    if (this.newDate.event.trim() && this.newDate.date.trim()) {
      if(this.admission.importantDates.length == 1 && this.admission.importantDates[0].event.trim() == '' && this.admission.importantDates[0].date.trim() == '') {
        this.admission.importantDates = [];
      }
      this.admission.importantDates.push({ ...this.newDate });
      this.closeDateModal();
    }
  }
  removeImportantDate(index: number) {
    this.admission.importantDates.splice(index, 1);
  }

  // ========= File Upload =========
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      if (file.size > 10 * 1024 * 1024) {
        this.toast.error('File size should not exceed 10 MB');
        input.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedFile = file;
        this.uploadedFileName = file.name;
        this.applicationFileUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // ========= Fetch Data =========
  fetchAdmissionData(): void {
    this.isLoadingAdmissionInfo = true;
    this.admissionService.getAdmissionDetails().subscribe({
      next: (data) => {
        if (data) {
          this.existingAdmission = data;
          this.showUploadForm = false;
          this.isLoadingAdmissionInfo = false;
        }
      },
      error: () => {
        this.toast.error('Failed to load admission details.');
        this.isLoadingAdmissionInfo = false;
      }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.showUpdateConfirm = true; // Trigger the modal
    } else {
      this.saveOrUpdate(); // For initial upload, no confirmation needed
    }
  }

  confirmUpdate() {
    this.showUpdateConfirm = false;

    const hasChanged = JSON.stringify(this.admission) !== JSON.stringify(this.existingAdmission);

    if (!hasChanged) {
      this.toast.info('No changes detected. Update not required.');
      return;
    }
    this.saveOrUpdate();
  }

  cancelUpdate() {
    this.showUpdateConfirm = false;
  }

  // ========= Save / Update =========
  saveOrUpdate(): void {
    if (!this.validateForm()) return;
    this.showUpdateConfirm = true;
    this.isLoading = true;
    const proceedToSubmit = (applicationFileUrl: string) => {
      this.admission.applicationFileUrl = applicationFileUrl;
      console.log("Uploaded File URL", applicationFileUrl);
      const formData = new FormData();
      const metadata = { ...this.admission };
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('existingImageUrl', this.existingApplicationFileUrl);

      const request$ = this.isEditMode
        ? this.admissionService.updateAdmissionDetails(formData)
        : this.admissionService.saveAdmissionDetails(formData);

      request$.subscribe({
        next: () => {
          this.toast.success(this.isEditMode ? 'Updated successfully.' : 'Uploaded successfully.');
          this.isEditMode = false;
          this.resetForm();
          this.fetchAdmissionData();
        },
        error: () => {
          this.toast.error('Something went wrong.');
          this.isLoading = false;
        }
      });
    };

    if (this.uploadedFile && !this.isEditMode) {
      proceedToSubmit(this.applicationFileUrl);
      return;
    }

    if (this.isEditMode && this.existingAdmission?.applicationFileUrl && this.uploadedFile) {
      console.error("Existing application file URL:", this.existingAdmission.applicationFileUrl);
      this.existingApplicationFileUrl = this.existingAdmission.applicationFileUrl;
      console.log("new application file URL:", this.applicationFileUrl);
      proceedToSubmit(this.applicationFileUrl);
    }else if (this.isEditMode && this.existingAdmission?.applicationFileUrl && !this.uploadedFile) {
      proceedToSubmit(this.existingAdmission?.applicationFileUrl);
    }
  }
  // ========= Form Utility =========
  validateForm(): boolean {
    const { contact, eligibility, documentsRequired, importantDates } = this.admission;

    if (!contact.phone.trim() || !contact.email.trim()) {
      this.toast.error('Contact phone and email are required.');
      return false;
    }
    if (!contact.phoneType.trim() || !contact.emailType.trim()) {
      this.toast.error('Contact phone type and email type are required.');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contact.email)) {
      this.toast.error('Please enter a valid email address.');
      return false;
    }

    if (!eligibility.length || eligibility.some(e => !e.trim())) {
      this.toast.error('Please provide at least one eligibility criteria.');
      return false;
    }

    if (!documentsRequired.length || documentsRequired.some(doc => !doc.trim())) {
      this.toast.error('Please provide at least one required document.');
      return false;
    }

    if (
      !importantDates.length ||
      importantDates.some(
        d =>
          !d.event?.trim() || false || !d.date?.trim()
      )
    ) {
      this.toast.error('Each important date must have both an event and a date.');
      return false;
    }

    if (!this.uploadedFile && !this.isEditMode) {
      this.toast.error('Please upload the application form file.');
      return false;
    }

    return true;
  }

  editAdmission(): void {
    if (!this.existingAdmission) return;
    this.admission = JSON.parse(JSON.stringify(this.existingAdmission));
    this.uploadedFile = null;
    this.uploadedFileName = '';
    this.isEditMode = true;
    this.showUploadForm = true;
  }

  hasValidEligibility(): boolean {
    return this.admission.eligibility.some(item => item.trim() !== '');
  }

  hasValidDocumentsRequired(): boolean {
    return this.admission.documentsRequired.some(item => item.trim() !== '');
  }

  hasValidImportantDates(): boolean {
    return this.admission.importantDates.some(date => date.event.trim() !== '' || date.date.trim() !== '');
  }

  resetForm(): void {
    this.admission = {
      id: 0,
      applicationFileUrl: '',
      contact: { phone: '', email: '', phoneType: '', emailType: '' },
      eligibility: [''],
      documentsRequired: [''],
      importantDates: [{ event: '', date: '' }]
    };
    this.uploadedFile = null;
    this.uploadedFileName = '';
    this.isLoading = false;
  }
}
