import { Component } from '@angular/core';
import {faFacebook, faGooglePlusG, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faEnvelope, faPhone} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-top-bar',
  imports: [
    FaIconComponent
  ],
  templateUrl: './top-bar.component.html',
  standalone: true,
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  faFacebook = faFacebook;
  protected readonly faTwitter = faTwitter;
  protected readonly faGooglePlusG = faGooglePlusG;
  protected readonly faPhone = faPhone;
  protected readonly faEnvelope = faEnvelope;
}
