import { Component } from '@angular/core';
import { faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import {FormsModule} from '@angular/forms';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {DatePipe, NgForOf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';

@Component({
  selector: 'app-lecture-notes',
  templateUrl: './lecture-notes.component.html',
  styleUrls: ['./lecture-notes.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    FaIconComponent,
    NgForOf,
    DatePipe,
    BreadcrumbsStyleComponent
  ], // Add CommonModule, FormsModule, FontAwesomeModule if needed
})
export class LectureNotesComponent {
  faDownload = faDownload;
  faFilePdf = faFilePdf;

  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 5;

  lectureNotes = [
    {
      subject: 'Mathematics - Algebra Basics',
      date: new Date('2025-04-15'),
      size: '1.2 MB',
      fileUrl: 'assets/notes/math-algebra.pdf'
    },
    {
      subject: 'Physics - Newton\'s Laws',
      date: new Date('2025-04-20'),
      size: '980 KB',
      fileUrl: 'assets/notes/physics-newton.pdf'
    },
    {
      subject: 'Biology - Cell Structure',
      date: new Date('2025-04-22'),
      size: '850 KB',
      fileUrl: 'assets/notes/biology-cells.pdf'
    },
    // Add more notes as needed
  ];

  get totalPages(): number {
    return Math.ceil(this.filteredNotes().length / this.itemsPerPage);
  }

  filteredNotes() {
    const query = this.searchQuery.toLowerCase();
    return this.lectureNotes
      .filter(note => note.subject.toLowerCase().includes(query))
      .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  changePage(direction: number) {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

  downloadFile(fileUrl: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'lecture-note.pdf';
    link.click();
  }
}
