import {Component, OnInit} from '@angular/core';
import { faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import {FormsModule} from '@angular/forms';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import {LectureNoteService} from '../../admin/services/lecture-note.service';
import {TableLoaderComponent} from "../../admin/shared/table-loader/table-loader.component";

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
        BreadcrumbsStyleComponent,
        NgIf,
        TableLoaderComponent
    ], // Add CommonModule, FormsModule, FontAwesomeModule if needed
})
export class LectureNotesComponent  implements OnInit{
  faDownload = faDownload;
  faFilePdf = faFilePdf;

  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 5;
  selectedClass: string = '';
  loading = false;

  lectureNotes = [
    {
      subject: '',
      date:'',
      size: '',
      classLevel: '',
      fileUrl: ''
    }
  ];

  // Generate unique class options dynamically
  get classOptions(): string[] {
    const unique = new Set(this.lectureNotes.map(note => note.classLevel));
    return Array.from(unique).sort();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredNotes().length / this.itemsPerPage);
  }

  filteredNotes() {
    const subjectQuery = this.searchQuery.toLowerCase();
    return this.lectureNotes
      .filter(note =>
        note.subject.toLowerCase().includes(subjectQuery) &&
        (this.selectedClass === '' || note.classLevel === this.selectedClass)
      )
      .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  changePage(direction: number) {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

  downloadFile(fileUrl: string) {
    if (isPlatformBrowser(this.platformId)) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop() || 'lecture-note.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('File download is only available in the browser.');
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private lectureNotesService: LectureNoteService) {}
  ngOnInit(): void {
    this.loading = true;
    this.lectureNotesService.getAllDocuments().subscribe(data => {
      let lectureNotes : { subject: string; date: string; size: string; classLevel: string; fileUrl: string }[] = [];
      data.forEach(note => {
        lectureNotes.push({
          subject: note.subject,
          date: note.date,
          size: note.size,
          classLevel: note.classLevel,
          fileUrl: note.fileUrl||''
        });
      });
      this.lectureNotes = lectureNotes;
      this.loading = false;
    });
  }
}
