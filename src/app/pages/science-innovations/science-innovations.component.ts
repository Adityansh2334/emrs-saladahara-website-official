import {Component, OnInit} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {NgForOf, NgIf} from '@angular/common';
import {AchievementService} from '../../admin/services/achievement.service';

@Component({
  selector: 'app-science-innovations',
  templateUrl: './science-innovations.component.html',
  styleUrls: ['./science-innovations.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbsStyleComponent,
    NgForOf,
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
export class ScienceInnovationsComponent implements OnInit {
  currentYear = new Date().getFullYear();

  innovationPrograms = [
    {
      title: 'Atal Tinkering Lab (ATL)',
      description: 'Fostering creativity and innovation through hands-on learning experiences.',
      image: 'atal.png'
    },
    {
      title: 'Robotics Club',
      description: 'Encouraging students to design and build robotic models, enhancing technical skills.',
      image: 'robotic.png'
    },
    {
      title: 'Science Exhibitions',
      description: 'Showcasing student projects and experiments, promoting scientific temper.',
      image: 'science.png'
    }
    ];

  achievements: { title: string; description: string; image: string }[] = [];

  constructor(private scienceInnovationsService: AchievementService) {
  }
  ngOnInit(): void {
    this.scienceInnovationsService.fetchAchievements('science')
      .then(achievements => {
        let achv: { title: string; description: string; image: string }[] = [];
        achievements.forEach(achievement => {
          achv.push({
            title: achievement.title,
            description: achievement.description,
            image: achievement.coverImage
          });
          this.achievements = achv;
        })
    });
  }
}
