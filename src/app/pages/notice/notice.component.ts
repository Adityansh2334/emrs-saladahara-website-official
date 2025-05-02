import { Component } from '@angular/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {DatePipe, NgForOf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  standalone: true,
  styleUrls: ['./notice.component.scss'],
  imports: [
    NgForOf,
    DatePipe,
    FaIconComponent,
    BreadcrumbsStyleComponent
  ]
})
export class NoticeComponent {
  faDownload = faDownload;
  currentPage = 1;
  itemsPerPage = 5;

  notices = [
    {
      name: 'Annual Report 2025',
      uploadedDate: new Date('2025-04-15'),
      size: '1.2 MB',
      fileUrl: 'assets/notices/annual-report-2025.pdf',
    },
    {
      name: 'Meeting Minutes - March',
      uploadedDate: new Date('2025-03-20'),
      size: '850 KB',
      fileUrl: 'assets/notices/meeting-minutes-march.pdf',
    },
    // ... add more notices
  ];

  get paginatedNotices() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.notices.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.notices.length / this.itemsPerPage);
  }

  changePage(delta: number) {
    this.currentPage = Math.min(Math.max(1, this.currentPage + delta), this.totalPages);
  }

  downloadFile(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop()!;
    link.click();
  }
}
