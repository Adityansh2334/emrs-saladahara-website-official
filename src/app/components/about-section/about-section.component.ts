import {Component, OnInit} from '@angular/core';
import {MessageModalComponent} from '../message-modal/message-modal.component';
import {NgIf} from '@angular/common';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import {PrincipalSecretaryService} from '../../admin/services/principal-secretary.service';

@Component({
  selector: 'app-about-section',
  imports: [MessageModalComponent, NgIf, FaIconComponent],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(40px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-40px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ])
  ],
  templateUrl: './about-section.component.html',
  standalone: true,
  styleUrl: './about-section.component.scss'
})
export class AboutSectionComponent  implements OnInit {
  faArrowRight = faArrowRight;
  modalOpen = false;
  modalMessage = '';
  modalTitle = '';
  modalAuthor = '';

  private readonly principalMessage = 'Here is the message from the Principal In-Charge...';
  private readonly principalSecretaryMessage = 'Here is the message from the Principal Secretary...';

  private principalDeepMessage: string = '';
  private principalSecretaryDeepMessage: string = '';
  private principalModalAuthor: string = '';
  private principalSecretaryModalAuthor: string = '';

  principalSecretary = {
    name: '',
    designation: '',
    image: '',
    message: this.principalSecretaryMessage
  };

  principal = {
    name: '',
    designation: '',
    image: '',
    message: this.principalMessage
  };

  openMessage(name: string, title: string): void {
    if (name === 'secretary') {
      this.modalTitle = title;
      this.modalMessage = this.principalSecretaryDeepMessage;
      this.modalAuthor = this.principalSecretaryModalAuthor;
    } else if (name === 'principal') {
      this.modalTitle = title;
      this.modalMessage = this.principalDeepMessage;
      this.modalAuthor = this.principalModalAuthor;
    }
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  constructor(private principalSecretaryService: PrincipalSecretaryService) {
  }

  ngOnInit(): void {
    this.principalSecretaryService.getPerson('principal').subscribe(principalSecretary => {
      if(Array.isArray(principalSecretary) && principalSecretary.length > 0) {
        this.principal.designation = principalSecretary[0].designation;
        this.principal.name = principalSecretary[0].name;
        this.principal.image = principalSecretary[0].imageUrl;
        this.principalDeepMessage = principalSecretary[0].message;
        this.principalModalAuthor = principalSecretary[0].name;
      }
    });
    this.principalSecretaryService.getPerson('secretary').subscribe(principalSecretary => {
      if(Array.isArray(principalSecretary) && principalSecretary.length > 0) {
        this.principalSecretary.designation = principalSecretary[0].designation;
        this.principalSecretary.name = principalSecretary[0].name;
        this.principalSecretary.image = principalSecretary[0].imageUrl;
        this.principalSecretaryDeepMessage = principalSecretary[0].message;
        this.principalSecretaryModalAuthor = principalSecretary[0].name;
      }
    })
  }
}
