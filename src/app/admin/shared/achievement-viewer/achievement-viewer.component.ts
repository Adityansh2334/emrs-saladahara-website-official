import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgForOf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faCheckCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FormsModule} from '@angular/forms';

interface Achievement {
  id?: number;
  title: string;
  coverImage: string; // Full image URL
  description: string;
  section: 'general' | 'sports' | 'science'; // <-- Added
}

@Component({
  selector: 'app-achievement-viewer',
  templateUrl: './achievement-viewer.component.html',
  styleUrls: ['./achievement-viewer.component.scss'],
  imports: [
    NgIf,
    NgForOf,
    FaIconComponent,
    FormsModule
  ],
  standalone: true
})
export class AchievementViewerComponent {
  @Input() achievements: Achievement[] = [];

  // @Output() edit = new EventEmitter<{ entry: Achievement; index: number }>();
  @Output() delete = new EventEmitter<{ id: number; image: string }>();
  @Output() saveEdit = new EventEmitter<Achievement>();
  @Output() imageSelected = new EventEmitter<{ index: number; file: File }>();

  faTrash = faTrash;
  faEdit = faEdit;
  faCheckCircle = faCheckCircle;


  // Pagination state
  currentPage = 1;
  itemsPerPage = 3;

  // Editing state
  editingAchievement: Achievement | null = null;
  editingIndex: number | null = null;

  get paginatedAchievements(): Achievement[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.achievements.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.achievements.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onDelete(id?: number, image:string = ''): void {
    if (id != null && image != '') this.delete.emit({ id , image});
  }

  onEdit(entry: Achievement, index: number): void {
    if(!entry) return;
    this.editingAchievement = { ...entry };
    this.editingIndex = index;
    // this.edit.emit({entry, index});
  }

  cancelEdit(): void {
    this.editingAchievement = null;
    this.editingIndex = null;
  }

  onImageSelectedEdit(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.editingAchievement) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.editingAchievement!.coverImage = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.imageSelected.emit({ index: this.editingIndex!, file });
  }

  onSaveEdit(): void {
      this.saveEdit.emit(this.editingAchievement as Achievement);
      this.cancelEdit();
  }
}
