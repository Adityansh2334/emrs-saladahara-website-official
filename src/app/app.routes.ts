import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { FacultyComponent } from './pages/faculty/faculty.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import {NoticeComponent} from './pages/notice/notice.component';
import {LectureNotesComponent} from './pages/lecture-notes/lecture-notes.component';
import {TendersComponent} from './pages/tenders/tenders.component';
import {ContactComponent} from './pages/contact/contact.component';
import {FacilitiesComponent} from './pages/facilities/facilities.component';
import {CurriculumComponent} from './pages/curriculum/curriculum.component';
import {AssessmentsExamsComponent} from './pages/assessments-exams/assessments-exams.component';
import {AcademicCalendarComponent} from './pages/academic-calendar/academic-calendar.component';
import {StudyResourcesComponent} from './pages/study-resources/study-resources.component';
import {PrincipalOfficeComponent} from './pages/principal-office/principal-office.component';
import {AdmissionComponent} from './pages/admission/admission.component';
import {HallOfAdministrationComponent} from './pages/hall-of-administration/hall-of-administration.component';
import {SportsFitnessComponent} from './pages/sports-fitness/sports-fitness.component';
import {ScienceInnovationsComponent} from './pages/science-innovations/science-innovations.component';
import {ParentTeacherMeetingsComponent} from './pages/parent-teacher-meetings/parent-teacher-meetings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'faculty', component: FacultyComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'admin', component: AdminLoginComponent },
  { path: 'notice', component: NoticeComponent },
  { path: 'lecture-notes', component: LectureNotesComponent },
  { path: 'tenders', component: TendersComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'facilities', component: FacilitiesComponent },
  { path: 'curriculum', component: CurriculumComponent },
  { path: 'exams', component: AssessmentsExamsComponent },
  { path: 'calendar', component: AcademicCalendarComponent },
  { path: 'resources', component: StudyResourcesComponent },
  { path: 'principal-office', component: PrincipalOfficeComponent },
  { path: 'admission', component: AdmissionComponent },
  { path: 'hall-of-administration', component: HallOfAdministrationComponent },
  { path: 'sports-fitness', component: SportsFitnessComponent },
  { path: 'science-innovations', component: ScienceInnovationsComponent },
  { path: 'parent', component: ParentTeacherMeetingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
