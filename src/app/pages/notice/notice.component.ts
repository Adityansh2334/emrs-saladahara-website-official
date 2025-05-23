import {Component, OnInit} from '@angular/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {DatePipe, isPlatformBrowser, NgForOf, NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import { Inject, PLATFORM_ID } from '@angular/core';
import {NoticeService} from '../../admin/services/notice.service';
import {TableLoaderComponent} from '../../admin/shared/table-loader/table-loader.component';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  standalone: true,
  styleUrls: ['./notice.component.scss'],
  imports: [
    NgForOf,
    DatePipe,
    FaIconComponent,
    BreadcrumbsStyleComponent,
    NgIf,
    TableLoaderComponent
  ]
})
export class NoticeComponent implements OnInit {
  faDownload = faDownload;
  currentPage = 1;
  itemsPerPage = 5;

  notices = [
    {
      name: '',
      uploadedDate: '',
      size: '',
      fileUrl: '',
    }
  ];
  loading = false;

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private noticeService: NoticeService) {}
  ngOnInit(): void {
    this.loading = true;
    this.noticeService.getAllDocuments().subscribe(docs => {
      let notices : { name: string; uploadedDate: string; size: string; fileUrl: string }[] = [];
      docs.forEach(doc => {
        notices.push({
          name: doc.name,
          uploadedDate: doc.uploadedDate,
          size: doc.size,
          fileUrl: doc.fileUrl||''
        });
      });
      this.notices = notices.sort((a, b) => {
        const dateA = new Date(a.uploadedDate);
        const dateB = new Date(b.uploadedDate);
        return dateB.getTime() - dateA.getTime();
      });
      this.loading = false;
    });
  }
}
