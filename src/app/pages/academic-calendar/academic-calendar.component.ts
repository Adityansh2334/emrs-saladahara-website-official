import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {NgClass, NgForOf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-academic-calendar',
  templateUrl: './academic-calendar.component.html',
  styleUrls: ['./academic-calendar.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    FaIconComponent,
    BreadcrumbsStyleComponent
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(40px)'}),
        animate('500ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
      ])
    ])
  ]
})

export class AcademicCalendarComponent {
  faDownload= faDownload
  calendarPdfUrl = '/assets/docs/academic-calendar-2025.pdf'; // <-- dynamic path from TS

  calendarEvents = [
    { month: 'January', title: 'Winter Break Ends', date: '10 Jan 2025', type: 'Holiday' },
    { month: 'February', title: 'Unit Test I Begins', date: '05 Feb 2025', type: 'Exam' },
    { month: 'March', title: 'Science Exhibition', date: '12 Mar 2025', type: 'Event' },
    { month: 'April', title: 'Final Exams', date: '15 Apr 2025', type: 'Exam' },
    { month: 'May', title: 'Summer Vacation Starts', date: '01 May 2025', type: 'Holiday' },
    { month: 'June', title: 'School Reopens', date: '15 Jun 2025', type: 'Event' },
    { month: 'August', title: 'Independence Day Celebration', date: '15 Aug 2025', type: 'Event' },
    { month: 'November', title: 'Birsa Munda Jayanti', date: '15 Nov 2025', type: 'Event' },
  ];

  // Extract year from the first event's date
  calendarYear: string;

  constructor() {
    this.calendarYear = new Date().getFullYear().toString();
  }
}
