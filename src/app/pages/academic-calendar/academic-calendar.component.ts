import {Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {NgClass, NgForOf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {AcademicCalendarService} from '../../admin/services/calendar.servcie';

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

export class AcademicCalendarComponent implements OnInit{
  faDownload= faDownload
  calendarPdfUrl = ''; // <-- dynamic path from TS

  calendarEvents = [
    {
      date:'',
      month: '',
      title: '',
      type: ''
    }
  ];

  // Extract year from the first event's date
  calendarYear: string;

  constructor(private calendarService: AcademicCalendarService) {
    this.calendarYear = new Date().getFullYear().toString();
  }

  ngOnInit(): void {
    this.calendarService.getCalendarData().subscribe(events => {
      this.calendarEvents = events.events;
      this.calendarPdfUrl = events.calendarPdfUrl;
    });
    }
}
