import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import { faBullhorn, faBookOpen, faFileContract } from '@fortawesome/free-solid-svg-icons';
import {LectureNoteService} from '../../admin/services/lecture-note.service';
import {NoticeService} from '../../admin/services/notice.service';
import {TenderService} from '../../admin/services/tender.service';

@Component({
  selector: 'app-notification-board',
  templateUrl: './notification-board.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgClass,
    FaIconComponent,
    NgIf
  ],
  styleUrls: ['./notification-board.component.scss']
})
export class NotificationBoardComponent  implements OnInit {
  faBullhorn = faBullhorn;
  faBookOpen = faBookOpen;
  faFileContract = faFileContract;
  faArrowRight =faArrowRight

  isLoadingNotice = true; // Initially true
  isLoadingTender = true; // Initially true
  isLoadingNotes = true; // Initially true
  skeletonArray = Array(4); // Adjust the number of loaders

  tenders = [
    { message: '' }
  ];

  lectNotes = [
    { message: '' }
  ];

  notices = [
    { message: ''}
  ];

  constructor(private lectureNoteService: LectureNoteService,
              private noticeService: NoticeService,
              private tendersService: TenderService) {
  }

  ngOnInit(): void {
    this.noticeService.getAllDocuments().subscribe({
      next: (docs) => {
        let notices : { message: string }[] = [];
        docs.forEach(doc => {
          notices.push({ message: doc.name });
        });
        this.notices = notices.sort((a, b) => {
          const dateA = new Date(a.message);
          const dateB = new Date(b.message);
          return dateB.getTime() - dateA.getTime();
        });
        this.isLoadingNotice = false;
      },
      error: () => {
        console.error('Failed to load notices');
        this.isLoadingNotice = false;
      }
    });

    this.lectureNoteService.getAllDocuments().subscribe({
      next: (docs) => {
        let lectNotes : { message: string }[] = [];
        docs.forEach(doc => {
          lectNotes.push({ message: doc.subject });
        });
        this.lectNotes = lectNotes.sort((a, b) => {
          const dateA = new Date(a.message);
          const dateB = new Date(b.message);
          return dateB.getTime() - dateA.getTime();
        });
        this.isLoadingNotes = false;
      },
      error: () => {
        console.error('Failed to load lecture notes');
        this.isLoadingNotes = false;
      }
    });

    this.tendersService.getAllDocuments().subscribe({
      next: (docs) => {
        let tenders : { message: string }[] = [];
        docs.forEach(doc => {
          tenders.push({ message: doc.title });
        });
        this.tenders = tenders.sort((a, b) => {
          const dateA = new Date(a.message);
          const dateB = new Date(b.message);
          return dateB.getTime() - dateA.getTime();
        });
        this.isLoadingTender = false;
      },
      error: () => {
        console.error('Failed to load tenders');
        this.isLoadingTender = false;
      }
    });
  }
}
