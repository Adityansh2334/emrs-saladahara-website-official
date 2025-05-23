import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';
import {ExamResultService} from '../../admin/services/exam-result.service';
import {TableLoaderComponent} from "../../admin/shared/table-loader/table-loader.component";

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  standalone: true,
    imports: [
        NgForOf,
        NgIf,
        NgClass,
        FormsModule,
        NgSelectComponent,
        TableLoaderComponent
    ],
  styleUrls: ['./exam-results.component.scss']
})
export class ExamResultsComponent implements OnInit {
  completedExams = [
    {
      name: '',
      class: '',
      date: '',
      resultUrl: ''
    }
  ];

  // Filter-related variables
  selectedExamClass: string | null = null;
  selectedExamName: string | null = null;
  examSearchText: string = '';

  examClassList:any[] = [];
  examNameList:any[] = [];
  loading = false;

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

  constructor(private examService: ExamResultService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.examService.getResults().subscribe({
      next: (data) => {
        this.completedExams = data.map(exam => ({
          name: exam.name,
          class: exam.classLevel,
          date: exam.date,
          resultUrl: exam.resultUrl
        }));

        this.examClassList = [...new Set(this.completedExams.map(a => a.class))].map(c => ({
          label: `Class ${c}`,
          value: c,
        }));

        this.examNameList = [...new Set(this.completedExams.map(a => a.name))].map(s => ({
          label: s,
          value: s,
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load exam results:', err);
        this.loading = false;
      }
    });
  }

  // This function can be used to handle any filter changes and pagination reset
  onExamFilterChange() {
    this.currentPage = 1; // Reset to the first page when filters change
  }
}
