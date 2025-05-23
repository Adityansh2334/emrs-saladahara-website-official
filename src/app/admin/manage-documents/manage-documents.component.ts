import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeDocumentsComponent } from './notice-documents/notice-documents.component';
import { LectureDocumentsComponent } from './lecture-documents/lecture-documents.component';
import { TenderDocumentsComponent } from './tender-documents/tender-documents.component';
import { AdmissionUploadComponent } from './admission-upload/admission-upload.component';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AcademicCalendarComponent} from './academic-calender/academic-calender.component';
import {UpcomingExamComponent} from './upcoming-exam/upcoming-exam.component';
import {ExamResultsComponent} from './exam-results/exam-results.component';
import {AssignmentUploadComponent} from './assignments-upload/assignments-upload.component';


export const CATEGORY_LIST = ['Notice', 'Lecture Note', 'Tender', 'Admission','Academic Calender','Upcoming Exam','Exam Result','Assignment'] as const;
export type Category = typeof CATEGORY_LIST[number];

@Component({
  selector: 'app-manage-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ],
  templateUrl: './manage-documents.component.html',
  styleUrls: ['./manage-documents.component.scss']
})
export class ManageDocumentsComponent {
  categories = CATEGORY_LIST;
  selectedCategory: Category = 'Notice';

  tabComponentMap: Record<Category, any> = {
    'Notice': NoticeDocumentsComponent,
    'Lecture Note': LectureDocumentsComponent,
    'Tender': TenderDocumentsComponent,
    'Admission': AdmissionUploadComponent,
    'Academic Calender': AcademicCalendarComponent,
    'Upcoming Exam': UpcomingExamComponent,
    'Exam Result': ExamResultsComponent,
    'Assignment': AssignmentUploadComponent
  };
}
