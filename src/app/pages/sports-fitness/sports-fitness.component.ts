import {Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {NgForOf, NgIf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {AchievementService} from '../../admin/services/achievement.service';

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
export class SportsFitnessComponent implements OnInit {
  currentYear = new Date().getFullYear();

  sportsFacilities = [
    { name: 'Football Ground', image: 'footballground.png' },
    { name: 'Basketball Court', image: 'basketballcourt.png' },
    { name: 'Volleyball Court', image: 'vollyballcourt.png' },
    { name: 'Athletics Track', image: 'athleticstrack.png' },
    { name: 'Yoga Hall', image: 'yogahall.png' },
    { name: 'Gymnasium', image: 'gym.png' }
  ];

  achievements: { title: string; description: string; image: string }[] = [];

  constructor(private sportsService: AchievementService) {
  }

  ngOnInit(): void {
    this.sportsService.fetchAchievements('sports').then(achievements => {
      let achv: { title: string; description: string; image: string }[] = [];
      achievements.forEach(achievement => {
        achv.push({
          title: achievement.title,
          description: achievement.description,
          image: achievement.coverImage
        });
        this.achievements = achv;
      })
    })
  }
}
