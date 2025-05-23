import {Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {NgForOf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {AdmissionService} from '../../admin/services/admission.service';

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
export class AdmissionComponent  implements OnInit {
  currentYear = new Date().getFullYear();
  nextYear = this.currentYear + 1;

  applicationFormUrl = '';

  contact = {
    phone: '',
    email: ''
  };
  admissionDetails = {
    eligibility: [
      ''
    ],
    documentsRequired: [
      ''
    ],
    importantDates: [
      {
        event: '',
        date: ''
      }
    ]
  };

  constructor(private admissionService: AdmissionService) { }

  ngOnInit(): void {
    this.admissionService.getAdmissionDetails().subscribe(data => {
      this.admissionDetails = data;
      this.applicationFormUrl = data.applicationFileUrl;
      this.contact = data.contact;
    });
  }
}
