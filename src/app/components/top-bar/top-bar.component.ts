import {Component, OnInit} from '@angular/core';
import {faFacebook, faGooglePlusG, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faEnvelope, faPhone} from '@fortawesome/free-solid-svg-icons';
import {ContactService} from '../../admin/services/contact.service';

@Component({
  selector: 'app-top-bar',
  imports: [
    FaIconComponent
  ],
  templateUrl: './top-bar.component.html',
  standalone: true,
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent  implements OnInit {
  faFacebook = faFacebook;
  protected readonly faTwitter = faTwitter;
  protected readonly faGooglePlusG = faGooglePlusG;
  protected readonly faPhone = faPhone;
  protected readonly faEnvelope = faEnvelope;

  phoneNumber = '+91-8917531040';
  email = 'principalemrssaldaharnilagir@gmail.com';

  constructor(private contactService: ContactService) {
  }
  ngOnInit(): void {
    this.contactService.getContacts().subscribe(data => {
      data.forEach(data => {
        if(data.emailType === 'contact') {
          this.email = data.email;
        }
        if (data.phoneType === 'contact') {
          this.phoneNumber = data.phone;
        }
        //break loop
        return;
      })
    });
  }
}
