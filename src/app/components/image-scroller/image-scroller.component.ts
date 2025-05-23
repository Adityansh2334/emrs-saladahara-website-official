import {Component, OnInit} from '@angular/core';
import {ImageViewerComponent} from '../image-viewer/image-viewer.component';
import {NgForOf, NgIf} from '@angular/common';
import {ImageUploadService} from '../../admin/services/image-upload.service';

@Component({
  selector: 'app-image-scroller',
  imports: [ImageViewerComponent, NgIf, NgForOf],
  templateUrl: './image-scroller.component.html',
  standalone: true,
  styleUrl: './image-scroller.component.scss'
})
export class ImageScrollerComponent implements OnInit{
  scrollImages: string[] = [];

  selectedImageIndex: number = 0;
  imageViewerOpen = false;

  openImageViewer(index: number) {
    if (index < 0 || index >= this.scrollImages.length) return;

    if (this.imageViewerOpen) {
      this.imageViewerOpen = false;
      setTimeout(() => {
        this.selectedImageIndex = index;
        this.imageViewerOpen = true;
      }, 10);
    } else {
      this.selectedImageIndex = index;
      this.imageViewerOpen = true;
    }
  }

  closeImageViewer() {
    this.imageViewerOpen = false;
  }

  constructor(private imageUploadService: ImageUploadService) {
  }

  ngOnInit(): void {
    this.imageUploadService.fetchUploadedImages('home_banner').subscribe(images => {
      this.scrollImages = images;
    });
  }
}
