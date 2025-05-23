import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { FacultyComponent } from './pages/faculty/faculty.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
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
import {LoginComponent} from './admin/login/login.component';
import {AuthGuard} from './admin/gaurds/gaurds.component';
import {DashboardComponent} from './admin/dashboard/dashboard.component';
import {NotAuthorizedComponent} from './pages/not-authorized/not-authorized.component';
import {AdminLayoutComponent} from './components/admin-layout/admin-layout.component';
import {PageUnderConstructionComponent} from './components/page-under-construction/page-under-construction.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'faculty', component: FacultyComponent },
  { path: 'feedback', component: FeedbackComponent },
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
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'page-under-construction', component: PageUnderConstructionComponent },
  { path: 'admin', component: NotAuthorizedComponent },
  { path: 'admin/login', component: LoginComponent },
  // Admin Routes wrapped with AdminLayout
  {
    path: 'admin',
    component: AdminLayoutComponent,  // Wrap with AdminLayout
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'manage-documents',
        loadComponent: () =>
          import('./admin/manage-documents/manage-documents.component').then(m => m.ManageDocumentsComponent),
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./admin/upload-gallery/upload-gallery.component').then(m => m.UploadGalleryComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./admin/contacts/contacts.component').then(m => m.ContactsComponent),
      },
      {
        path: 'hoa-documents',
        loadComponent: () =>
          import('./admin/hall-of-admin-documents/hall-of-admin-documents.component').then(m => m.HallAdminDocumentsComponent),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
