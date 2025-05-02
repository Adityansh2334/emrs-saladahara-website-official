import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {NgForOf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';

@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    BreadcrumbsStyleComponent
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
export class AdmissionComponent {
  currentYear = new Date().getFullYear();
  nextYear = this.currentYear + 1;

  applicationFormUrl = '/assets/forms/emrsst-application-form.pdf';

  contact = {
    phone: '+91-1234567890',
    email: 'admissions@emrssaladahara.in'
  };
  admissionDetails = {
    eligibility: [
      'Must be a bonafide resident of Odisha.',
      'Studied and passed Class V from a recognized school.',
      'Age between 9 to 11 years as of 1st May of the admission year.',
      'Has not appeared in the EMRSST previously.'
    ],
    documentsRequired: [
      'Birth Certificate',
      'Domicile Certificate',
      'Caste Certificate (if applicable)',
      'Previous School’s Transfer Certificate',
      'Passport-sized Photographs'
    ],
    importantDates: [
      { event: 'Application Start Date', date: '1st March 2025' },
      { event: 'Application End Date', date: '31st March 2025' },
      { event: 'Entrance Test Date', date: '15th April 2025' },
      { event: 'Result Declaration', date: '30th April 2025' }
    ]
  };
}
