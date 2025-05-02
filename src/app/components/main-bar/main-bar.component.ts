import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-main-bar',
  imports: [
    RouterLink
  ],
  templateUrl: './main-bar.component.html',
  standalone: true,
  styleUrl: './main-bar.component.scss'
})
export class MainBarComponent {

}
