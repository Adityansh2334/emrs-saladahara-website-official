import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';  // Using 'of' to return mock data

@Injectable({
  providedIn: 'root'
})
export class AssessmentsExamsServiceService {
  constructor() { }

  // Mock upcoming exams
  getUpcomingExams(): Observable<any> {
    const mockUpcomingExams = [
      { name: 'Term 1 Final', date: '2025-05-10' },
      { name: 'Mid-Term Exam', date: '2025-06-01' }
    ];
    return of(mockUpcomingExams);  // Return mock data as an observable
  }

  // Mock completed exams data
  getCompletedExams(): Observable<any> {
    const mockCompletedExams = [
      { name: 'Term 1', class: 'Class 10', date: '2024-02-15', resultStatus: 'Available' },
      { name: 'Mid-Term', class: 'Class 9', date: '2024-11-20', resultStatus: 'Not Available' }
    ];
    return of(mockCompletedExams);  // Return mock data as an observable
  }

  // Mock assessments data
  getAssessments(): Observable<any> {
    const mockAssessments = [
      { class: 'Class 9', subject: 'Mathematics', title: 'Linear Equations Quiz', teacher: 'Mr. Raj Kumar', dueDate: '2025-05-15', status: 'Open' },
      { class: 'Class 10', subject: 'English', title: 'Essay Writing Task', teacher: 'Mrs. Sangeeta Das', dueDate: '2025-05-12', status: 'Pending' }
    ];
    return of(mockAssessments);  // Return mock data as an observable
  }

  // Mock motivational resources
  getMotivationalResources(): Observable<any> {
    const mockResources = [
      {
        class: 'Class 9',
        subjects: [
          {
            name: 'Mathematics',
            resources: [
              { title: 'Basic Algebra', url: 'https://example.com/algebra', icon: 'book' },
              { title: 'Linear Equations', url: 'https://example.com/linear-equations', icon: 'book' }
            ]
          },
          {
            name: 'Science',
            resources: [
              { title: 'Physics Concepts', url: 'https://example.com/physics', icon: 'book' }
            ]
          }
        ]
      },
      {
        class: 'Class 10',
        subjects: [
          {
            name: 'English',
            resources: [
              { title: 'Essay Writing Tips', url: 'https://example.com/essay-writing', icon: 'book' }
            ]
          }
        ]
      }
    ];
    return of(mockResources);  // Return mock data as an observable
  }
}
