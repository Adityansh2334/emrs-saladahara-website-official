import { Component, OnInit } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {start} from 'node:repl';

@Component({
  selector: 'app-upcoming-exams',
  templateUrl: './upcoming-exams.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf
  ],
  styleUrls: ['./upcoming-exams.component.scss']
})
export class UpcomingExamsComponent implements OnInit {
  sortColumn: 'class' | 'date' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  upcomingExams = [
    { name: 'First Term Exam', class: '6', date: '2025-06-10', time: '10:00 AM' },
    { name: 'Mid Term Exam', class: '7', date: '2025-06-15', time: '11:00 AM' },
    { name: 'Final Exam', class: '8', date: '2025-07-01', time: '09:00 AM' },
    { name: 'Unit Test 1', class: '9', date: '2025-07-10', time: '12:00 PM' },
    { name: 'Quarterly Exam', class: '10', date: '2025-07-20', time: 'TBD' },
    { name: 'Mock Exam', class: '10', date: '2025-07-25', time: '10:30 AM' },
    // ... Add more as needed
  ];

  upcomingPage = 1;
  upcomingItemsPerPage = 5;

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

  ngOnInit(): void {
  }

}
