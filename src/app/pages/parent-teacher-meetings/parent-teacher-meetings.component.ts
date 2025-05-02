import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {CommonModule, DatePipe, NgForOf, NgIf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';

@Component({
  selector: 'app-parent-teacher-meetings',
  templateUrl: './parent-teacher-meetings.component.html',
  styleUrls: ['./parent-teacher-meetings.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    BreadcrumbsStyleComponent,
    NgForOf,
    CommonModule,
    NgIf
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
export class ParentTeacherMeetingsComponent {
  currentYear = new Date().getFullYear();

  meetingSchedule:any = [
    // If empty, fallback message will show
    {
      date: '2025-06-15',
      time: '10:00 AM - 1:00 PM',
      venue: 'School Auditorium',
      agenda: 'Mid-term academic review and student development strategies.'
    }
  ];

  pastMeetings = [
    {
      date: '2024-12-10',
      summary: 'Discussion on exam performance and progress. Parents provided suggestions for more cultural activities.',
      outcome: 'Agreed to increase monthly academic monitoring and host two cultural weeks per year.'
    },
    {
      date: '2024-06-15',
      summary: 'Focus on language skill improvement. Parents raised transport concerns.',
      outcome: 'Remedial English sessions introduced and transport committee formed.'
    }
  ];
}
