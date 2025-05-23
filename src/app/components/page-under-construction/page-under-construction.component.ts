import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTools, faClock } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-under-construction',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './page-under-construction.component.html',
  styleUrls: ['./page-under-construction.component.scss']
})
export class PageUnderConstructionComponent {
  faTools = faTools;
  faClock = faClock;
}
