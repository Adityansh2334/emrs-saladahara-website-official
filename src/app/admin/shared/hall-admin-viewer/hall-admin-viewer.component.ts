import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import {NgForOf, NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

interface Hoa {
  id?: number;
  name: string;
  designation: string;
  photo: string;
}

@Component({
  selector: 'app-hall-admin-viewer',
  standalone: true,
  imports: [
    NgIf,
    FaIconComponent,
    NgForOf
  ],
  templateUrl: './hall-admin-viewer.component.html'
})
export class HallAdminViewerComponent {
  @Input() hoaList: Hoa[] = [];
  @Output() delete = new EventEmitter<{ id: number|undefined; image: string }>();
  @Output() edit = new EventEmitter<any>();

  faTrash = faTrash;
  faEdit = faEdit;

  currentPage = 1;
  itemsPerPage = 3;

  get paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.hoaList.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.hoaList.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
