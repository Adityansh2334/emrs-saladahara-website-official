import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal-office.component.html',
  styleUrls: ['./principal-office.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbsStyleComponent
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(20px)'}),
        animate('600ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ])
    ])
  ]
})
export class PrincipalOfficeComponent {

  principal = {
    name: 'Dr. Ramesh Kumar Singh',
    image: 'assets/images/principal.jpg' // Update the path to your actual image location
  };
}
