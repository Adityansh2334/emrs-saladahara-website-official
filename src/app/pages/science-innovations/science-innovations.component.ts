import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {NgForOf, NgIf} from '@angular/common';

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
export class ScienceInnovationsComponent {
  currentYear = new Date().getFullYear();

  innovationPrograms = [
    {
      title: 'Atal Tinkering Lab (ATL)',
      description: 'Fostering creativity and innovation through hands-on learning experiences.',
      image: '/assets/images/innovation/atl.jpg'
    },
    {
      title: 'Robotics Club',
      description: 'Encouraging students to design and build robotic models, enhancing technical skills.',
      image: '/assets/images/innovation/robotics.jpg'
    },
    {
      title: 'Science Exhibitions',
      description: 'Showcasing student projects and experiments, promoting scientific temper.',
      image: '/assets/images/innovation/exhibition.jpg'
    }
    // Add more programs as needed
  ];

  achievements:any = [
    {
      title: 'National Science Fair 2023',
      description: 'Our students secured 1st place with their innovative project on sustainable energy.',
      image: '/assets/images/achievements/science-fair.jpg'
    },
    {
      title: 'Innovation Challenge 2022',
      description: 'Recognized for outstanding contribution in developing low-cost water purification systems.',
      image: '/assets/images/achievements/innovation-challenge.jpg'
    }
    // Add more achievements as needed
  ];
}
