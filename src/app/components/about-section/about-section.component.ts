import { Component } from '@angular/core';
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
export class AboutSectionComponent {
  faArrowRight = faArrowRight;
  modalOpen = false;
  modalMessage = '';
  modalTitle = '';
  modalAuthor = '';

  principalSecretary = {
    name: 'Shri Sanjeeb Kumar Mishra, IAS',
    designation: 'Principal Secretary',
    image: 'principal_secretery.png', // or from backend
    message: 'Here is the message from the Principal Secretary...'
  };

  principal = {
    name: 'Mr. Krushna Chandra Behera',
    designation: 'Principal In-Charge',
    image: 'prin_img.jpeg', // or from backend
    message: 'Here is the message from the Principal In-Charge...'
  };

  openMessage(name: string, title: string): void {
    if (name === 'Shri Sanjeeb Kumar Mishra, IAS') {
      this.modalTitle = title;
      this.modalMessage = `You carry within you the strength of your heritage, the wisdom of your ancestors, and the power to shape a future of dignity and success. Never let circumstances define your limits—your dreams are valid, and your aspirations are powerful.

Education is your strongest tool—use it not just to rise, but to lift your community along with you. Your identity is a source of pride, and your journey is a story the world needs to hear.

The government is with you, and we are committed to ensuring that no dream remains out of reach. Believe in yourself, stay curious, stay courageous—and always remember, the roots you come from are the wings that will help you soar.

The future of our nation lies in your hands—make it bright, make it yours.`;
      this.modalAuthor = 'Shri Sanjeeb Kumar Mishra';
    } else if (name === 'Mr. Krushna Chandra Behera') {
      this.modalTitle = title;
      this.modalMessage = `As Principal In-Charge of EMRS Saladahara, I take great pride in your achievements and resilience. This institution was built to empower you with knowledge, discipline, and a spirit of excellence.

Continue to work hard, stay focused, and remember that your efforts today shape the future for your communities tomorrow.

With best wishes.`;
      this.modalAuthor = 'Mr. Krushna Chandra Behera';
    }
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }
}
