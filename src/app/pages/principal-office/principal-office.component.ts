import {Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {PersonData, PrincipalSecretaryService} from '../../admin/services/principal-secretary.service';

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
export class PrincipalOfficeComponent  implements OnInit{

  principal = {
    name: '',
    image: ''
  };

  constructor(private principalSecretaryService: PrincipalSecretaryService) {
  }

  ngOnInit(): void {
    this.principalSecretaryService.getPerson('principal').subscribe({
      next: (data: PersonData) => {
        if(Array.isArray(data) && data.length > 0) {
          this.principal.name = data[0].name;
          this.principal.image = data[0].imageUrl;
        }
      },
      error: (error) => {
        console.error('Error fetching principal data:', error);
      }
    });
  }

}
