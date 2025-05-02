import { Component } from '@angular/core';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    BreadcrumbsStyleComponent
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'] // ✅ Use `styleUrls` not `styleUrl`
})
export class AboutComponent {
}
