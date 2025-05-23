import {Component, OnInit} from '@angular/core';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {RouterLink} from '@angular/router';
import {ContactService} from '../../admin/services/contact.service';

@Component({
  selector: 'app-above-footer',
  imports: [
    FaIconComponent,
    RouterLink
  ],
  templateUrl: './above-footer.component.html',
  standalone: true,
  styleUrl: './above-footer.component.scss'
})
export class AboveFooterComponent implements OnInit{
  faAngleRight = faAngleRight;

  emailId = 'principalemrssaldaharnilagir@gmail.com'
  phoneNumber = '+91-8917531040'

  constructor(private contactService: ContactService) {
  }
  ngOnInit(): void {
    this.contactService.getContacts().subscribe(data => {
      data.forEach(data => {
        if(data.emailType === 'contact') {
          this.emailId = data.email;
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
