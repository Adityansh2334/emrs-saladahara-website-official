import { Component } from '@angular/core';
import {ImageViewerComponent} from '../../components/image-viewer/image-viewer.component';
import {NgForOf, NgIf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-gallery',
  imports: [ImageViewerComponent, NgForOf, NgIf, BreadcrumbsStyleComponent],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ // when *ngIf shows the element
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [ // when *ngIf removes the element
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './gallery.component.html',
  standalone: true,
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  activeSection: any = null;

  gallerySections = [
    {
      title: 'Library',
      coverImage: 'emrs (1).jpg',
      images: [
        'emrs (1).jpg',
        'emrs (1).jpg',
        'emrs (1).jpg',
      ],
    },
    {
      title: 'Hostel Life',
      coverImage: 'emrs (1).jpg',
      images: [
        'emrs (1).jpg',
        'emrs (1).jpg',
        'emrs (1).jpg',
      ],
    },
    {
      title: 'Events',
      coverImage: 'emrs (1).jpg',
      images: [
        'emrs (1).jpg',
        'emrs (1).jpg',
        'emrs (1).jpg',
      ],
    },
    // Add more sections as needed
  ];

  openModal(section: any) {
    this.activeSection = section;
    this.selectedImageIndex = 0; // Reset to the first image
    this.isViewerOpen = false;   // Ensure viewer is not open
  }

  closeModal() {
    this.activeSection = null;
    this.selectedImageIndex = 0;
    this.isViewerOpen = false;
  }

  //Image Viewer
  isViewerOpen = false;
  selectedImageIndex = 0;

  openImageViewer(index: number) {
    if (this.isViewerOpen) {
      this.isViewerOpen = false;
      setTimeout(() => {
        this.selectedImageIndex = index;
        this.isViewerOpen = true;
      }, 10);
    } else {
      this.selectedImageIndex = index;
      this.isViewerOpen = true;
    }
  }
}
