import { Component, OnInit } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {UpcomingExamService} from '../../admin/services/upcoming-exam.service';
import {TableLoaderComponent} from '../../admin/shared/table-loader/table-loader.component';

@Component({
  selector: 'app-upcoming-exams',
  templateUrl: './upcoming-exams.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    TableLoaderComponent
  ],
  styleUrls: ['./upcoming-exams.component.scss']
})
export class UpcomingExamsComponent implements OnInit {
  sortColumn: 'class' | 'date' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  upcomingExams = [
    {
      name: '',
      class: '',
      date: '',
      time: ''
    }
  ];

  upcomingPage = 1;
  upcomingItemsPerPage = 5;
  loading = false;

  get paginatedUpcomingExams() {
    const start = (this.upcomingPage - 1) * this.upcomingItemsPerPage;
    return this.upcomingExams.slice(start, start + this.upcomingItemsPerPage);
  }

  get upcomingTotalPages() {
    return Math.ceil(this.upcomingExams.length / this.upcomingItemsPerPage);
  }

  goToUpcomingPage(page: number) {
    if (page >= 1 && page <= this.upcomingTotalPages) {
      this.upcomingPage = page;
    }
  }

  sortBy(column: 'class' | 'date') {
    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortUpcomingExams();
  }

  sortUpcomingExams() {
    this.upcomingExams.sort((a, b) => {
      const valA = this.sortColumn === 'date' ? new Date(a.date) : a.class;
      const valB = this.sortColumn === 'date' ? new Date(b.date) : b.class;

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  constructor(private upcomingExamsService: UpcomingExamService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.upcomingExamsService.getExams().subscribe(data => {
      let upcomingExams: { name: string; class: string; date: string; time: string; }[] = [];
      data.forEach(exam => {
        upcomingExams.push({
          name: exam.name,
          class: exam.classLevel,
          date: exam.date,
          time: exam.time
        });
      });
      this.upcomingExams = upcomingExams;
      this.sortUpcomingExams();
      this.loading = false;
        }
      );
  }
}
