import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';
import {Assignment, AssignmentService} from '../../admin/services/assignment.service';
import {TableLoaderComponent} from '../../admin/shared/table-loader/table-loader.component';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgSelectComponent,
    NgClass,
    NgIf,
    TableLoaderComponent
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
      class: '',
      subject: '',
      title: '',
      teacher: '',
      dueDate: '',
      fileUrl: ''
    }
  ];

  classList: { label: string; value: string }[] = [];
  subjectList: { label: string; value: string }[] = [];

  selectedClass: null = null;
  selectedSubject: null = null;
  searchTitle: string = '';
  loading = false;

  constructor(private assignmentService: AssignmentService) {}

  ngOnInit(): void {
    this.loading = true;
    this.assignmentService.getAssignments().subscribe(data => {
      let assignmentsDb: { class: string; subject: string; title: string; teacher: string; dueDate: string; fileUrl: string; }[] = [];
      data.forEach(assignment => {
        assignmentsDb.push({
          class: assignment.classLevel,
          subject: assignment.subject,
          title: assignment.title,
          teacher: assignment.teacher,
          dueDate: assignment.dueDate,
          fileUrl: assignment.fileUrl
        });
      });
      this.assignments = assignmentsDb;
      console.log('Fetched Assignments:', this.assignments);

      // ✅ Now move below logic inside subscribe
      this.classList = [...new Set(this.assignments.map(a => a.class))].map(c => ({
        label: "Class " + c,
        value: c,
      }));

      this.subjectList = [...new Set(this.assignments.map(a => a.subject))].map(s => ({
        label: s,
        value: s,
      }));

      this.updateAssignmentPagination();
      this.loading = false;
    });
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
