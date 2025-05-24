import { Component } from '@angular/core';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    BreadcrumbsStyleComponent
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'] // ✅ Use `styleUrls` not `styleUrl`
})
export class AboutComponent {
}
