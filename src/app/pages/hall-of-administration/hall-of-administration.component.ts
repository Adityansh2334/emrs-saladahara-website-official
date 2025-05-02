import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-hall-of-administration',
  templateUrl: './hall-of-administration.component.html',
  styleUrls: ['./hall-of-administration.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbsStyleComponent,
    NgForOf
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(20px)'}),
        animate('600ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ])
    ])
  ]
})
export class HallOfAdministrationComponent {
  currentYear = new Date().getFullYear();

  administrationDocuments = [
    { title: 'Society Registration Certificate', url: '/assets/documents/society-registration.pdf' },
    { title: 'Recognition Certificate', url: '/assets/documents/recognition-certificate.pdf' },
    { title: 'No Objection Certificate', url: '/assets/documents/noc.pdf' },
    { title: 'Building Safety Certificate', url: '/assets/documents/building-safety.pdf' },
    { title: 'Fire Safety Certificate', url: '/assets/documents/fire-safety.pdf' },
    { title: 'Self Certification', url: '/assets/documents/self-certification.pdf' }
  ];

  administrativeStaff = [
    { name: 'Dr. Ramesh Kumar Singh', designation: 'Principal', photo: '/assets/images/staff/principal.jpg' },
    { name: 'Ms. Anjali Sharma', designation: 'Vice Principal', photo: '/assets/images/staff/vice-principal.jpg' },
    { name: 'Mr. Suresh Das', designation: 'Administrative Officer', photo: '/assets/images/staff/admin-officer.jpg' },
    { name: 'Ms. Priya Patel', designation: 'Accounts Officer', photo: '/assets/images/staff/accounts-officer.jpg' }
    // Add more staff members as needed
  ];
}
