import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-general-gallery-image-uploader',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent],
  templateUrl: './general-gallery-image-uploader.component.html',
  styleUrls: ['./general-gallery-image-uploader.component.scss']
})
export class GeneralGalleryImageUploaderComponent {
  faUpload = faUpload;

  @Input() disabled: boolean = false;
  @Input() selectedImage: string = '';
  @Output() imageSelected = new EventEmitter<File[]>();

  selectedFileName: string = '';

  onFileSelected(event: Event, fileInput: HTMLInputElement) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      alert(`❌ Image exceeds ${maxSizeInMB}MB. Please upload a smaller file.`);
      fileInput.value = '';
      this.selectedFileName = '';
      this.selectedImage = '';
      return;
    }

    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
      this.imageSelected.emit([file]);
    };
    reader.readAsDataURL(file);

    fileInput.value = ''; // Allow re-selecting the same file
  }
}
