import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {NgForOf, NgIf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';

@Component({
  selector: 'app-sports-fitness',
  templateUrl: './sports-fitness.component.html',
  styleUrls: ['./sports-fitness.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    BreadcrumbsStyleComponent,
    NgIf
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
export class SportsFitnessComponent {
  currentYear = new Date().getFullYear();

  sportsFacilities = [
    { name: 'Football Ground', image: '/assets/images/sports/football.jpg' },
    { name: 'Basketball Court', image: '/assets/images/sports/basketball.jpg' },
    { name: 'Volleyball Court', image: '/assets/images/sports/volleyball.jpg' },
    { name: 'Athletics Track', image: '/assets/images/sports/athletics.jpg' },
    { name: 'Yoga Hall', image: '/assets/images/sports/yoga.jpg' },
    { name: 'Gymnasium', image: '/assets/images/sports/gym.jpg' }
  ];

  achievements:any = [
    {
      title: 'National EMRS Sports Meet 2019',
      description: 'Secured 22 Gold, 18 Silver, and 8 Bronze medals at the 2nd National EMRS Sports Meet held in Bhopal.',
      image: '/assets/images/achievements/emrs-sports-meet-2019.jpg'
    },
    {
      title: 'State Level Athletics Championship',
      description: 'Our students showcased exceptional performance, bringing home multiple medals.',
      image: '/assets/images/achievements/state-athletics.jpg'
    }
    // Add more achievements as needed
  ];
}
