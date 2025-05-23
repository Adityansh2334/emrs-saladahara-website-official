import {Component, OnInit} from '@angular/core';
import {ImageViewerComponent} from '../../components/image-viewer/image-viewer.component';
import {NgForOf, NgIf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import {GeneralGalleryService} from '../../admin/services/general-gallery.service';

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
export class GalleryComponent  implements OnInit{
  activeSection: any = null;

  gallerySections = [
    {
      title: '',
      coverImage: '',
      images: [
        ''
      ],
    }
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

  constructor(private galleryService: GeneralGalleryService) {
  }

  ngOnInit(): void {
    this.galleryService.getAllGalleries().subscribe(data => {
      this.gallerySections = data;
    });
  }
}
