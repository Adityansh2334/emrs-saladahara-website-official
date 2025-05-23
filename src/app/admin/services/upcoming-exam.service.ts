import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';


export interface UpcomingExam {
  id?: number;
  name: string;
  classLevel: string;
  date: string;
  time: string;
  datetime: string;
}
@Injectable({ providedIn: 'root' })
export class UpcomingExamService {
  private baseUrl = '';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    } else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/upcoming-exams';
  }

  uploadExams(exam: UpcomingExam[]): Observable<any> {
    return this.http.post(this.baseUrl, exam);
  }

  getExams(): Observable<UpcomingExam[]> {
    return this.http.get<UpcomingExam[]>(this.baseUrl);
  }

  deleteExam(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
