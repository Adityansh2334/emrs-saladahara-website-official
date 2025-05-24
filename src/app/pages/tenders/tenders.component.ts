import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {NgForOf, NgIf} from '@angular/common';
import {TenderService} from '../../admin/services/tender.service';
import {TableLoaderComponent} from "../../admin/shared/table-loader/table-loader.component";
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  standalone: true,
    imports: [
        FormsModule,
        BreadcrumbsStyleComponent,
        NgForOf,
        NgIf,
        TableLoaderComponent
    ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {
  searchQuery: string = '';
  loading = false;
  tenders = [
    { title: '', date: '', fileUrl: '' }
  ];

  get filteredTenders() {
    return this.tenders.filter(t =>
      t.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  constructor(private tendersService: TenderService ) {}

  ngOnInit(): void {
    this.loading = true;
    this.tendersService.getAllDocuments().subscribe(docs => {
      let tenders : { title: string; date: string; fileUrl: string }[] = [];
      docs.forEach(doc => {
        tenders.push({
          title: doc.title,
          date: doc.date,
          fileUrl: doc.fileUrl||''
        });
      });
      this.tenders = tenders.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      this.loading = false;
    });
  }
}
