import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass, NgForOf} from '@angular/common';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import { faBullhorn, faBookOpen, faFileContract } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notification-board',
  templateUrl: './notification-board.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgClass,
    FaIconComponent
  ],
  styleUrls: ['./notification-board.component.scss']
})
export class NotificationBoardComponent {
  faBullhorn = faBullhorn;
  faBookOpen = faBookOpen;
  faFileContract = faFileContract;
  faArrowRight =faArrowRight
  tenders = [
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', }
    // Add more notices as needed
  ];

  lectNotes = [
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', }
  ];

  notices = [
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', },
    { message: 'COMING SOON...', }
  ];
}
