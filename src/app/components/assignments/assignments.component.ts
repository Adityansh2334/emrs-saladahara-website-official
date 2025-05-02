import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgSelectComponent,
    NgClass,
    NgIf
  ],
  styleUrls: ['./assignments.component.scss']
})
export class AssignmentsComponent implements OnInit {
  paginatedAssignments: any[] = [];
  assignmentPage = 1;
  itemsPerPage = 10;
  assignmentTotalPages = 1;

  assignments = [
    {
      class: '8',
      subject: 'Science',
      title: 'Human Body Assignment',
      teacher: 'Mrs. Roy',
      dueDate: '2025-05-10',
      fileUrl: '/assets/assignments/human-body.pdf',
    },
    {
      class: '9',
      subject: 'Mathematics',
      title: 'Algebra Worksheet',
      teacher: 'Mr. Das',
      dueDate: '2025-05-12',
      fileUrl: '/assets/assignments/algebra.pdf',
    },
    {
      class: '8',
      subject: 'Science',
      title: 'Human Body Assignment',
      teacher: 'Mrs. Roy',
      dueDate: '2025-05-10',
      fileUrl: '/assets/assignments/human-body.pdf',
    },
    {
      class: '9',
      subject: 'Mathematics',
      title: 'Algebra Worksheet',
      teacher: 'Mr. Das',
      dueDate: '2025-05-12',
      fileUrl: '/assets/assignments/algebra.pdf',
    },
    {
      class: '8',
      subject: 'Science',
      title: 'Human Body Assignment',
      teacher: 'Mrs. Roy',
      dueDate: '2025-05-10',
      fileUrl: '/assets/assignments/human-body.pdf',
    },
    {
      class: '9',
      subject: 'Mathematics',
      title: 'Algebra Worksheet',
      teacher: 'Mr. Das',
      dueDate: '2025-05-12',
      fileUrl: '/assets/assignments/algebra.pdf',
    },
    {
      class: '8',
      subject: 'Science',
      title: 'Human Body Assignment',
      teacher: 'Mrs. Roy',
      dueDate: '2025-05-10',
      fileUrl: '/assets/assignments/human-body.pdf',
    },
    {
      class: '9',
      subject: 'Mathematics',
      title: 'Algebra Worksheet',
      teacher: 'Mr. Das',
      dueDate: '2025-05-12',
      fileUrl: '/assets/assignments/algebra.pdf',
    },
    {
      class: '8',
      subject: 'Science',
      title: 'Human Body Assignment',
      teacher: 'Mrs. Roy',
      dueDate: '2025-05-10',
      fileUrl: '/assets/assignments/human-body.pdf',
    },
    {
      class: '9',
      subject: 'Mathematics',
      title: 'Algebra Worksheet',
      teacher: 'Mr. Das',
      dueDate: '2025-05-12',
      fileUrl: '/assets/assignments/algebra.pdf',
    },
    {
      class: '8',
      subject: 'Science',
      title: 'Human Body Assignment',
      teacher: 'Mrs. Roy',
      dueDate: '2025-05-10',
      fileUrl: '/assets/assignments/human-body.pdf',
    },
    {
      class: '9',
      subject: 'Mathematics',
      title: 'Algebra Worksheet',
      teacher: 'Mr. Das',
      dueDate: '2025-05-12',
      fileUrl: '/assets/assignments/algebra.pdf',
    },
    {
      class: '8',
      subject: 'Science',
      title: 'Human Body Assignment',
      teacher: 'Mrs. Roy',
      dueDate: '2025-05-10',
      fileUrl: '/assets/assignments/human-body.pdf',
    },
    {
      class: '9',
      subject: 'Mathematics',
      title: 'Algebra Worksheet',
      teacher: 'Mr. Das',
      dueDate: '2025-05-12',
      fileUrl: '/assets/assignments/algebra.pdf',
    },
    {
      class: '8',
      subject: 'Science',
      title: 'Human Body Assignment',
      teacher: 'Mrs. Roy',
      dueDate: '2025-05-10',
      fileUrl: '/assets/assignments/human-body.pdf',
    },
    {
      class: '9',
      subject: 'Mathematics',
      title: 'Algebra Worksheet',
      teacher: 'Mr. Das',
      dueDate: '2025-05-12',
      fileUrl: '/assets/assignments/algebra.pdf',
    }
  ];

  classList: { label: string; value: string }[] = [];
  subjectList: { label: string; value: string }[] = [];

  selectedClass: null = null;
  selectedSubject: null = null;
  searchTitle: string = '';

  ngOnInit(): void {
    this.classList = [...new Set(this.assignments.map(a => a.class))].map(c => ({
      label: "Class " + c,
      value: c,
    }));

    this.subjectList = [...new Set(this.assignments.map(a => a.subject))].map(s => ({
      label: s,  // Just the subject name, no "Class" prefix here
      value: s,
    }));
    this.updateAssignmentPagination();
  }

  /**
   * Filter the assignments based on the selected class, subject, and search title.
   *
   * The filter conditions are as follows:
   * - If `selectedClass` is not null, only include assignments with that class.
   * - If `selectedSubject` is not null, only include assignments with that subject.
   * - If `searchTitle` is not empty, only include assignments whose title (case-insensitive) includes the search string.
   *
   * @returns The filtered list of assignments.
   */
  filteredAssignments() {
    return this.assignments.filter(a =>
      (!this.selectedClass || a.class === this.selectedClass) &&
      (!this.selectedSubject || a.subject === this.selectedSubject) &&
      (!this.searchTitle || a.title.toLowerCase().includes(this.searchTitle.toLowerCase()))
    );
  }

  updateAssignmentPagination(): void {
    const filtered = this.filteredAssignments();
    this.assignmentTotalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.assignmentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAssignments = filtered.slice(start, end);
  }

  goToAssignmentPage(page: number): void {
    if (page < 1 || page > this.assignmentTotalPages) return;
    this.assignmentPage = page;
    this.updateAssignmentPagination();
  }

  onFilterChange(): void {
    this.assignmentPage = 1;
    this.updateAssignmentPagination();
  }
}
