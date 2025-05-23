import { Component } from '@angular/core';
import { FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { faTrash, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PrincipalUploadComponent} from '../gallery/principal-upload/principal-upload.component';
import {UploadFacultyStaffComponent} from '../gallery/faculty-upload/faculty-upload.component';
import {HallAdminUploadComponent} from '../gallery/hall-admin-upload/hall-admin-upload.component';
import {GeneralGalleryUploadComponent} from '../gallery/general-gallery-upload/general-gallery-upload.component';
import {
  AchievementUploadComponent
} from '../gallery/upload-achievements/upload-achievements.component';
import {HomepageBannersUploadComponent} from '../gallery/upload-homepage-banners/upload-homepage-banners.component';

interface GalleryImage {
  id: number;
  url: string;
  caption: string;
}

@Component({
  selector: 'app-upload-gallery',
  templateUrl: './upload-gallery.component.html',
  styleUrls: ['./upload-gallery.component.scss'],
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    PrincipalUploadComponent,
    UploadFacultyStaffComponent,
    HallAdminUploadComponent,
    GeneralGalleryUploadComponent,
    HomepageBannersUploadComponent,
    AchievementUploadComponent,
    NgClass,
  ],
  standalone: true
})
export class UploadGalleryComponent {
  sections = [
    { key: 'home-scroll', label: 'Homepage Scroll Banners' },
    { key: 'achievement', label: 'Achievements at a Glance' },
    { key: 'sports-fitness', label: 'Sports & Fitness' },
    { key: 'science-innovation', label: 'Science & Innovation' },
    { key: 'principal-secretary', label: 'Principal & Secretary Photos' },
    { key: 'faculty-staff', label: 'Faculty & Staff' },
    { key: 'hall-administration', label: 'Hall of Administration' },
    { key: 'general-gallery', label: 'General Gallery' },
  ];

  activeSection = 'home-scroll';
  images: { [key: string]: GalleryImage[] } = {};

  constructor(library: FaIconLibrary) {
    library.addIcons(faTrash, faDownload, faTimes);
    // this.sections.forEach(s => (this.images[s.key] = []));
  }
  setActiveSection(sectionKey: string) {
    this.activeSection = sectionKey;
    setTimeout(() => {
      const el = document.getElementById(sectionKey);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }


}
