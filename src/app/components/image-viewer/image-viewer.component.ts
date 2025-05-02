import {Component, HostListener, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-image-viewer',
  imports: [
    NgIf
  ],
  templateUrl: './image-viewer.component.html',
  standalone: true,
  styleUrl: './image-viewer.component.scss'
})
export class ImageViewerComponent {

  @Input() images: (string | Element)[] = [];
  @Input() currentIndex: number = 0;
  @Input() isOpen: boolean = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isOpen) return;
    if (event.key === 'ArrowRight') this.nextImage();
    else if (event.key === 'ArrowLeft') this.previousImage();
    else if (event.key === 'Escape') this.closeViewer();
  }

  closeViewer() {
    this.isOpen = false;
  }

  nextImage() {
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }

  previousImage() {
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }
}
