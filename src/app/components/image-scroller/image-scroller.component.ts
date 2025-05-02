import { Component } from '@angular/core';
import {ImageViewerComponent} from '../image-viewer/image-viewer.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-image-scroller',
  imports: [ImageViewerComponent, NgIf, NgForOf],
  templateUrl: './image-scroller.component.html',
  standalone: true,
  styleUrl: './image-scroller.component.scss'
})
export class ImageScrollerComponent {
  scrollImages: string[] = [
    'emrs (1).jpg',
    'emrs (2).jpg',
    'emrs (3).jpg',
    'emrs (4).jpg',
    'emrs (5).jpg',
    'emrs (6).jpg',
    'emrs (7).jpg',
    'emrs (8).jpg',
    'emrs (9).jpg',
    'emrs (10).jpg',
    'emrs (11).jpg',
    'emrs (12).jpg',
    'emrs (13).jpg',
    'emrs (14).jpg'
  ];

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
}
