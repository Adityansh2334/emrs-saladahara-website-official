import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import Swiper from 'swiper';
import { AchievementService } from '../../admin/services/achievement.service';

// Initialize Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-achievement-glance',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './achievement-glance.component.html',
  styleUrls: ['./achievement-glance.component.scss']
})
export class AchievementGlanceComponent implements OnInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  achievements: { caption: string; image: string }[] = [];

  govLinks = [
    {
      title: 'National Portal of India',
      url: 'https://india.gov.in/',
      image: 'npi.jpeg'
    },
    {
      title: 'Ministry of Tribal Affairs',
      url: 'https://tribal.nic.in/',
      image: 'mta.jpeg'
    },
    {
      title: 'TDD, Odisha',
      url: 'https://stsc.odisha.gov.in/',
      image: 'tdd.jpeg'
    },
    {
      title: 'NCST',
      url: 'https://ncst.nic.in/',
      image: 'ncst.jpg'
    },
    {
      title: 'Odisha Government',
      url: 'https://odisha.gov.in/',
      image: 'odisha.jpeg'
    }
  ];

  constructor(private achievementService: AchievementService) {}

  ngOnInit(): void {
    this.achievementService.fetchAchievements('general').then((achievements) => {
      const achv: { caption: string; image: string }[] = [];
      achievements.forEach((achievement) => {
        achv.push({
          caption: achievement.description,
          image: achievement.coverImage
        });
      });

      this.achievements = achv;

      // Delay to ensure DOM is rendered before initializing Swiper
      setTimeout(() => {
        this.initializeSwiper();
      }, 100);
    });
  }

  initializeSwiper() {
    new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      autoplay: {
        stopOnLastSlide: false,
        disableOnInteraction: false,
        delay: 3000,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }
}
