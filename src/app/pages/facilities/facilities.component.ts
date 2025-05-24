import {ChangeDetectorRef, Component} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {ImageViewerComponent} from '../../components/image-viewer/image-viewer.component';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-facilities',
  imports: [
    NgForOf,
    BreadcrumbsStyleComponent,
    NgIf,
    CarouselModule,
    ImageViewerComponent
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ // when *ngIf shows the element
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [ // when *ngIf removes the element
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ])
  ],
  templateUrl: './facilities.component.html',
  standalone: true,
  styleUrl: './facilities.component.scss'
})
export class FacilitiesComponent {
  selectedFacility: any = null;
  imageViewerOpen = false;
  scrollImages: string[] = [];
  selectedImageIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  facilities = [
    {
      title: 'Smart Classrooms',
      icon: '💡',
      image: 'SmartClass.png',
      images_modal:['smart_class1.jpg','smart_class2.jpg'],
      description: `Equipped with interactive whiteboards, digital projectors, and high-speed internet to support immersive learning.`,
      deep_description:"Our smart classrooms are equipped with interactive whiteboards, high-resolution projectors, and audio-visual aids that enhance the learning experience. These digital tools make lessons engaging, support visual learning, and promote collaboration among students."
    },
    {
      title: 'Labs',
      icon: '🧪',
      image: 'Lab.png',
      images_modal:['lab1.jpg','lab2.jpg','lab3.jpg','lab5.jpg'],
      description: `Well-equipped Physics, Chemistry, Biology, and Computer labs fostering innovation through hands-on experiments.`,
      deep_description:"The school features well-equipped science and computer labs designed to offer hands-on learning. Students conduct experiments, build models, and explore simulations, fostering curiosity, innovation, and scientific thinking in a safe, supervised environment."
    },
    {
      title: 'Library',
      icon: '📚',
      image: 'Library.png',
      images_modal:['library1.jpg','library2.jpg'],
      description: `A quiet and resourceful space with academic and non-academic literature to encourage independent study.`,
      deep_description:"Our well-stocked library houses a diverse collection of books, journals, magazines, and digital resources. Designed as a quiet sanctuary for learning, it supports academic excellence and encourages a lifelong love for reading and research."
    },
    {
      title: 'Sports Complex',
      icon: '🏅',
      image: 'SportsComplex.png',
      images_modal:['sport1.jpg','sport2.jpg','sport3.jpg','sport4.jpg'],
      description: `Multi-sport facility including football field, basketball court, and indoor games to nurture athletic skills.`,
      deep_description:"The modern sports complex includes fields and courts for football, basketball, volleyball, and indoor games. Supervised by trained coaches, our sports facilities promote fitness, discipline, and teamwork among students."
    },
    {
      title: 'Hostel Accommodations',
      icon: '🛏️',
      image: 'Hostel.png',
      images_modal:['hostel1.jpg','hostel2.jpg','hostel3.jpg'],
      description: `Safe and supervised dormitories with nutritious meals and medical support.`,
      deep_description:"The hostel provides a secure and homely atmosphere for students staying on campus. With well-furnished rooms, nutritious meals, and pastoral care, it ensures students feel supported both emotionally and academically."
    },
    {
      title: 'Auditorium',
      icon: '🎤',
      image: 'Auditorium.png',
      images_modal:[],
      description: `State-of-the-art auditorium for events, seminars, and stage performances, with modern acoustics and seating.`,
      deep_description:"The spacious auditorium is designed for school functions, cultural events, and guest lectures. With modern acoustics, stage lighting, and comfortable seating, it serves as a vibrant center for creativity, expression, and community engagement."
    }
  ];

  openModal(facility: any): void {
    this.selectedFacility = facility;
    this.scrollImages = facility.images_modal;
    this.selectedImageIndex = 0;
    this.imageViewerOpen = false;
    this.cdr.detectChanges(); // Force view update
  }

  closeModal(): void {
    this.selectedFacility = null;
    this.imageViewerOpen = false;
    this.selectedImageIndex = 0;
  }

  carouselOptions = {
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    nav: true,
    dots: true,
    navText: ['←', '→'],
    responsive: {
      0: { items: 1 },
      768: { items: 1 },
      1024: { items: 1 },
    }
  };

  openImageViewer(index: number): void {
    this.selectedImageIndex = index;
    this.imageViewerOpen = true;
  }
  closeImageViewer() {
    this.imageViewerOpen = false;
  }
}
