import {Component, OnInit} from '@angular/core';
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
import {FacultyService} from '../../admin/services/faculty.service';

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
export class FacultyComponent  implements OnInit{
  faUserTie = faUserTie;
  faChalkboardTeacher = faChalkboardTeacher;
  faUsers = faUsers;

  filter: string = 'all';

  staff = [
    {
      name: '',
      designation: '',
      category: '',
      image: '',
      bio: ''
    }
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

  constructor(private facultyService: FacultyService) {
  }

  ngOnInit(): void {
    this.facultyService.getAllFaculty().subscribe(data => {
      this.staff = data;
    });
  }
}
