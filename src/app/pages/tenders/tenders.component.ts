import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  standalone: true,
  imports: [
    FormsModule,
    BreadcrumbsStyleComponent,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {
  searchQuery: string = '';
  tenders = [
    { title: 'Construction Tender - Phase 1', date: '2025-05-01', fileUrl: '/assets/tenders/tender1.pdf' },
    { title: 'Canteen Contract Notice', date: '2025-04-28', fileUrl: '/assets/tenders/tender2.pdf' },
    { title: 'Furniture Supply Tender', date: '2025-04-20', fileUrl: '/assets/tenders/tender3.pdf' }
    // Add more tenders here
  ];

  get filteredTenders() {
    return this.tenders.filter(t =>
      t.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  constructor() {}

  ngOnInit(): void {}
}
