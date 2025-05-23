import {Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {NgForOf, NgIf} from '@angular/common';
import {UpcomingExamsComponent} from '../../components/upcoming-exams/upcoming-exams.component';
import {ExamResultsComponent} from '../../components/exam-results/exam-results.component';
import {AssignmentsComponent} from '../../components/assignments/assignments.component';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments-exams.component.html',
  styleUrls: ['./assessments-exams.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    UpcomingExamsComponent,
    ExamResultsComponent,
    AssignmentsComponent,
    BreadcrumbsStyleComponent
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(20px)'}),
        animate('500ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ])
    ]),
    trigger('expandAnimation', [
      transition(':enter', [
        style({height: 0, opacity: 0}),
        animate('300ms ease', style({height: '*', opacity: 1}))
      ]),
      transition(':leave', [
        animate('300ms ease', style({height: 0, opacity: 0}))
      ])
    ])
  ]
})
export class AssessmentsExamsComponent{

  activeTab = 'upcomingExams';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

}
