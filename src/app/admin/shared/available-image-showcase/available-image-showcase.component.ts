import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-available-image-showcase',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './available-image-showcase.component.html',
  styleUrls: ['./available-image-showcase.component.scss']
})
export class AvailableImageShowcaseComponent implements OnInit, OnChanges {
  @Input() imageUrls: string[] = [];
  @Output() deleteImage = new EventEmitter<string>();

  faTrash = faTrash;
  faDownload = faDownload;

  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;
  paginatedImages: string[] = [];

  ngOnInit(): void {
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrls']) {
      this.currentPage = 1; // reset to first page on input change
      this.updatePagination();
    }
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedImages = this.imageUrls.slice(start, end);
    this.totalPages = Math.ceil(this.imageUrls.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  onDelete(url: string): void {
    this.deleteImage.emit(url);
  }

  onDownload(url: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'banner.jpg';
    link.click();
  }
}
