import { Component } from '@angular/core';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {RouterLink} from '@angular/router';

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
export class AboveFooterComponent {
  faAngleRight = faAngleRight;
}
