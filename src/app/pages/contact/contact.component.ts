import { Component } from '@angular/core';
import {SafeUrlPipe} from '../../pipes/safe-url.pipe';
import {NgForOf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt, faEnvelopeOpenText, faCity, faFlag, faLocationCrosshairs,faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [
    SafeUrlPipe,
    NgForOf,
    BreadcrumbsStyleComponent,
    FaIconComponent
  ],
  standalone: true
})
export class ContactComponent {
  // FontAwesome icons
  faMapMarkerAlt = faMapMarkerAlt;
  faEnvelopeOpenText = faEnvelopeOpenText;
  faCity = faCity;
  faFlag = faFlag;
  faLocationCrosshairs = faLocationCrosshairs;
  faPhone = faPhone;
  faEnvelope = faEnvelope;

  address = {
    at: 'Saladahara',
    post: 'Berhampur',
    dist: 'Balasore',
    state: 'Odisha',
    pin: '756058',
  };
  phoneNumbers = ['+1 234 567 890', '+1 987 654 321'];
  emails = ['info@school.com', 'contact@school.com'];
  mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d237496.66707966357!2d86.3518928!3d21.551335!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1c4736e2b9c61d%3A0x41738f85140f6f7c!2sEkalabya%20Model%20Residential%20School%2C%20Saldahar!5e0!3m2!1sen!2sin!4v1746127177084!5m2!1sen!2sin'; // Replace with your actual map URL
}
