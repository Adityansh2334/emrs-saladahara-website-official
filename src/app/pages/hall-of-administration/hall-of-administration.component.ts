import {Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {NgForOf} from '@angular/common';
import {AdminDocument, HallAdminService} from '../../admin/services/hall-admin.service';

@Component({
  selector: 'app-hall-of-administration',
  templateUrl: './hall-of-administration.component.html',
  styleUrls: ['./hall-of-administration.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbsStyleComponent,
    NgForOf
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
export class HallOfAdministrationComponent  implements OnInit{
  currentYear = new Date().getFullYear();

  administrationDocuments:AdminDocument[] = [];

  administrativeStaff = [
    { name: '', designation: '', photo: '' }
  ];

  constructor(private hallAdminService: HallAdminService) {
  }

  ngOnInit(): void {
    this.hallAdminService.getHOA().subscribe(hoa => {
      this.administrativeStaff = hoa;
    })
    this.hallAdminService.getHoaDocuments().subscribe(docs => {
      this.administrationDocuments = docs;
    })
  }
}
