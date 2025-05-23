import { Component, Input } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-table-loader',
  templateUrl: './table-loader.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./table-loader.component.scss']
})
export class TableLoaderComponent {
  @Input() colspan = 3;
  @Input() rows = 4; // number of skeleton rows to show
}
