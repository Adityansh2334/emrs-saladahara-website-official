import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd, RouterLink, RouterModule} from '@angular/router';
import { filter } from 'rxjs';
import {CommonModule, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-breadcrumbs-style',
  imports: [
    CommonModule, RouterModule
  ],
  templateUrl: './breadcrumbs-style.component.html',
  standalone: true,
  styleUrl: './breadcrumbs-style.component.scss'
})
export class BreadcrumbsStyleComponent {
  @Input() pageName: string = '';
}
