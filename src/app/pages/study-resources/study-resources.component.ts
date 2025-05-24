import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {BreadcrumbsStyleComponent} from '../../components/breadcrumbs-style/breadcrumbs-style.component';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-study-resources',
  templateUrl: './study-resources.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    BreadcrumbsStyleComponent
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ])
  ],
  styleUrls: ['./study-resources.component.scss']
})
export class StudyResourcesComponent implements OnInit {

  activeTab: string = 'textbooks';

  // Data for Textbooks
  textbooks = [
    {
      title: 'Mathematics for Class 1',
      description: 'Download the official CBSE syllabus and textbook for Class 1 Mathematics.',
      downloadLink: '#'
    },
    {
      title: 'Science for Class 2',
      description: 'Explore interactive resources for Class 2 Science education.',
      downloadLink: '#'
    },
    // Add more textbooks as needed
  ];

  // Data for Practice Papers
  practicePapers = [
    {
      title: 'Math Practice Paper',
      description: 'Download the Math practice papers for Class 1 and improve your skills.',
      downloadLink: '#'
    },
    {
      title: 'English Practice Paper',
      description: 'Boost your English writing skills with these practice papers.',
      downloadLink: '#'
    },
    // Add more practice papers as needed
  ];

  // Function to switch active tab
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  ngOnInit(): void {
  }
}
