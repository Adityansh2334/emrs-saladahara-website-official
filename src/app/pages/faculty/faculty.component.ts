import { Component } from '@angular/core';
import { faUserTie, faChalkboardTeacher, faUsers } from '@fortawesome/free-solid-svg-icons';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-faculty',
  imports: [
    LazyLoadImageModule,
    NgClass,
    BreadcrumbsStyleComponent,
    NgIf,
    NgForOf
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
    ])
  ],
  templateUrl: './faculty.component.html',
  standalone: true,
  styleUrl: './faculty.component.scss'
})
export class FacultyComponent {
  faUserTie = faUserTie;
  faChalkboardTeacher = faChalkboardTeacher;
  faUsers = faUsers;

  filter: string = 'all';

  staff = [
    {
      name: 'Mr. Arjun Minz',
      designation: 'PGT Science',
      category: 'teaching',
      image: 'assets/faculty/arjun.jpg',
      bio: 'M.Sc. in Physics, B.Ed. 5 years teaching experience.'
    },
    {
      name: 'Ms. Leela Kisku',
      designation: 'Administrative Assistant',
      category: 'non-teaching',
      image: 'assets/faculty/leela.jpg',
      bio: 'Handles all admin tasks. Joined in 2024.'
    },
    // Add more as needed...
  ];

  selectedStaff: any = null;

  get filteredStaff() {
    if (this.filter === 'all') return this.staff;
    return this.staff.filter(member => member.category === this.filter);
  }

  openModal(member: any) {
    this.selectedStaff = member;
  }

  closeModal() {
    this.selectedStaff = null;
  }

  setFilter(filter: string) {
    this.filter = filter;
  }
}
