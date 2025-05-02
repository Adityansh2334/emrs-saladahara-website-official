import {Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {AssessmentsExamsServiceService} from '../../services/assessments-exams-service.service';
import {NgForOf, NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
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
export class AssessmentsExamsComponent implements OnInit{

  activeTab = 'upcomingExams';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  upcomingExams: any[] = [];
  completedExams: any[] = [];
  assessments: any[] = [];
  motivationalResources: any[] = [];
  expanded: Record<string, boolean> = {};

  constructor(private assessmentsService: AssessmentsExamsServiceService) {}

  ngOnInit() {
    // Fetch all data on initialization
    this.getUpcomingExams();
    this.getCompletedExams();
    this.getAssessments();
  }

  // Get upcoming exams data
  getUpcomingExams() {
    this.assessmentsService.getUpcomingExams().subscribe(data => {
      this.upcomingExams = data;
    });
  }

  // Get completed exams data
  getCompletedExams() {
    this.assessmentsService.getCompletedExams().subscribe(data => {
      this.completedExams = data;
    });
  }

  // Get assessments data
  getAssessments() {
    this.assessmentsService.getAssessments().subscribe(data => {
      this.assessments = data;
    });
  }

  toggleClass(cls: string) {
    this.expanded[cls] = !this.expanded[cls];
  }
}
