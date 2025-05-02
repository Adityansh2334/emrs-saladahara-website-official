import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    FormsModule,
    NgSelectComponent
  ],
  styleUrls: ['./exam-results.component.scss']
})
export class ExamResultsComponent implements OnInit {
  completedExams = [
    {
      name: 'Mid Term Exam',
      class: '8',
      date: '2025-03-15',
      resultStatus: 'Available',
      resultUrl: '/assets/results/midterm-class8.pdf'
    },
    {
      name: 'Final Exam',
      class: '9',
      date: '2025-04-25',
      resultStatus: 'Pending'
    },
    {
      name: 'Mid Term Exam',
      class: '8',
      date: '2025-03-15',
      resultStatus: 'Available',
      resultUrl: '/assets/results/midterm-class8.pdf'
    },
    {
      name: 'Final Exam',
      class: '9',
      date: '2025-04-25',
      resultStatus: 'Pending'
    },
    // Add more exam data as needed...
  ];

  // Filter-related variables
  selectedExamClass: string | null = null;
  selectedExamName: string | null = null;
  examSearchText: string = '';

  examClassList:any[] = [];
  examNameList:any[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  get filteredExams() {
    return this.completedExams.filter((exam) => {
      const matchesClass = this.selectedExamClass ? exam.class === this.selectedExamClass : true;
      const matchesExamName = this.selectedExamName ? exam.name === this.selectedExamName : true;
      const matchesSearch = this.examSearchText
        ? exam.name.toLowerCase().includes(this.examSearchText.toLowerCase())
        : true;

      return matchesClass && matchesExamName && matchesSearch;
    });
  }

  get paginatedExams() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredExams.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredExams.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  ngOnInit(): void {
    // Initialize any data or logic here
    this.examClassList = [...new Set(this.completedExams.map(a => a.class))].map(c => ({
      label: `Class ${c}`,
      value: c,
    }));

    this.examNameList = [...new Set(this.completedExams.map(a => a.name))].map(s => ({
      label: s,  // Just the subject name, no "Class" prefix here
      value: s,
    }));
  }

  // This function can be used to handle any filter changes and pagination reset
  onExamFilterChange() {
    this.currentPage = 1; // Reset to the first page when filters change
  }
}
