import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPen, faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

interface Faculty {
  id?: number;
  name: string;
  designation: string;
  image: string;
  category: string;
  bio: string;
}

@Component({
  selector: 'app-faculty-staff-viewer',
  templateUrl: './faculty-staff-viewer.component.html',
  styleUrls: ['./faculty-staff-viewer.component.scss'],
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule, FaIconComponent]
})
export class FacultyViewerComponent {
  @Input() facultyList: Faculty[] = [];

  // @Output() edit = new EventEmitter<{ entry: Faculty; index: number }>();
  @Output() delete = new EventEmitter<{ id: number; image: string }>();
  @Output() saveEdit = new EventEmitter<Faculty>();
  @Output() imageSelected = new EventEmitter<{ index: number; file: File }>();

  // Icons
  penIcon: IconDefinition = faPen;
  trashIcon: IconDefinition = faTrash;
  faCheckCircle: IconDefinition = faCheckCircle;

  // Pagination
  currentPage = 1;
  itemsPerPage = 3;

  // Editing state
  editingFaculty: Faculty | null = null;
  editingIndex: number | null = null;

  get totalPages(): number {
    return Math.ceil(this.facultyList.length / this.itemsPerPage);
  }

  get paginatedFaculty(): Faculty[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.facultyList.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onEdit(entry: Faculty, index: number): void {
    this.editingFaculty = { ...entry };
    this.editingIndex = index;
  }

  cancelEdit(): void {
    this.editingFaculty = null;
    this.editingIndex = null;
  }

  onSaveEdit(): void {
    if (this.editingFaculty) {
      console.log(this.editingFaculty);
      this.saveEdit.emit(this.editingFaculty);
    }
    this.cancelEdit();
  }

  onDelete(id?: number, image:string = ''): void {
    if (id != null && image != '') {
      this.delete.emit({ id, image });
    }
  }

  onImageSelectedEdit(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.editingFaculty) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.editingFaculty!.image = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.imageSelected.emit({ index: this.editingIndex!, file });
  }
}
